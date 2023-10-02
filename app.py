from flask import Flask, render_template, Response,request,jsonify,redirect
from flask_cors import CORS 
import cv2
import face_recognition
import numpy as np
import os
import time
import threading
app=Flask(__name__)
CORS(app)
import psycopg2
from psycopg2 import Error


try:
    connection = psycopg2.connect(user="postgres",
                                  password="123456",
                                  host="localhost",
                                  port="5432",
                                  database="students")
    cursor = connection.cursor()

    # SQL query to create a new table with entry and exit time columns
    create_tables_query = '''
    CREATE TABLE students
    (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        date DATE NOT NULL,
        entry_time TIME,
        exit_time TIME
    );

    CREATE TABLE studentsdata
    (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phonenumber VARCHAR NOT NULL,
        department VARCHAR NOT NULL
    );
    '''

    # Execute the create table query
    cursor.execute(create_tables_query)
    connection.commit()

    print("Tables created successfully in PostgreSQL")

except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL", error)
finally:
    # Closing database connection.
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")
path = 'myimages'
images = []
classNames = []
mylist = os.listdir(path)

for cl in mylist:
    curImg = cv2.imread(f'{path}/{cl}')
    images.append(curImg)
    classNames.append(os.path.splitext(cl)[0])

def findEncodings(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(img)

        # Check if any faces were found in the image
        if not face_locations:
            continue

        encoded_face = face_recognition.face_encodings(img, face_locations)[0]
        encodeList.append(encoded_face)
    return encodeList


encoded_face_train = findEncodings(images)

user_counts={}
def store_employee_timings(name, date, hour):
    global user_counts, last_recognition_time
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="123456",
                                      host="localhost",
                                      port="5432",
                                      database="students")
        cursor = connection.cursor()
        
        # Query to check the number of times the user has been seen by the camera today
        user_saw_today_query = f"SELECT COUNT(*) FROM students WHERE date = '{date}' AND name = '{name}'"
        cursor.execute(user_saw_today_query)
        count = cursor.fetchone()[0]
        print("count", count)

        if name not in user_counts:
            user_counts[name] = 0

        if count == 0:
            # User not found in the database for today, create a new row with entry_time
            print('User recognized - Entry time')

            # Create a new row for the user today
            insert_user_query = f"INSERT INTO students (name, date, entry_time) VALUES ('{name}', '{date}', '{hour}')"
            print('Attendance Taken')
            cursor.execute(insert_user_query)
            user_counts[name] += 1
            print("cnt", user_counts[name])
        else:
            if user_counts[name] % 2 == 0:
                # User recognized odd number of times, create a new row with entry_time again
                print('User recognized again - Entry time')

                # Create a new row for the user today
                insert_user_query = f"INSERT INTO students (name, date, entry_time) VALUES ('{name}', '{date}', '{hour}')"
                print('Attendance Taken')
                cursor.execute(insert_user_query)
                user_counts[name] += 1
                print("cnt", user_counts[name])
            else:
                # User recognized even number of times, update the exit_time
                print('User recognized - Exit time')

                # Update departure time for the user for the last entry on the same date
                update_user_query = f"""
                    UPDATE students
                    SET exit_time = '{hour}'
                    WHERE id = (
                        SELECT id
                        FROM students
                        WHERE name = '{name}' AND date = '{date}'
                        ORDER BY entry_time DESC
                        LIMIT 1
                    )
                """
                print('Attendance Taken')
                cursor.execute(update_user_query)
                user_counts[name] += 1
                print("cnt", user_counts[name])
        last_recognition_time[name] = time.time()
        connection.commit()
        return redirect('/')
    
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return redirect('/')
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
  
RECOGNITION_COOLDOWN = 5
  # 20 seconds

last_recognition_time = {}  # Dictionary to keep track of the last recognition time for each user
json_to_export = {}
cap = cv2.VideoCapture(0)
def gen_frames():
    while True:
        success, frame = cap.read() # read the camera frame
        if not success:
            break
        else:
            imgS = cv2.resize(frame, (0, 0), None, 0.25, 0.25)
            imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)
            faces_in_frame = face_recognition.face_locations(imgS)
            encoded_faces = face_recognition.face_encodings(imgS, faces_in_frame)
            landmarks = face_recognition.face_landmarks(imgS, faces_in_frame)
            for encode_face, faceloc in zip(encoded_faces, faces_in_frame):
                if not encoded_faces:
                    continue  # Skip the current iteration if no faces were found
                
                matches = face_recognition.compare_faces(encoded_face_train, encode_face)
                faceDist = face_recognition.face_distance(encoded_face_train, encode_face)
                matchIndex = np.argmin(faceDist)
                if matches[matchIndex]:
                    name = classNames[matchIndex].upper().lower()
                    print(name)
                    y1, x2, y2, x1 = faceloc
                    # since we scaled down by 4 times
                    y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
                    json_to_export['name'] = name
                    json_to_export['hour'] = f'{time.localtime().tm_hour}:{time.localtime().tm_min}'
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.rectangle(frame, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)

                    # Display the recognized name and time inside the rectangle
                    text_to_display = f'{name} - {json_to_export["hour"]}'
                    cv2.putText(frame, text_to_display, (x1 + 6, y2 - 5), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

                    json_to_export['date'] = f'{time.localtime().tm_year}-{time.localtime().tm_mon}-{time.localtime().tm_mday}'
                    #print(json_to_export)
                    json_to_export['picture_array'] = frame.tolist()
                    json_to_export['recognized'] = True  # Add a new key to indicate recognition status
                    json_to_export['attendance_taken'] = True  # Add a new key to indicate if attendance was taken
                    # Pass None for exit_time when no exit time is detected

                    # Check cooldown for the user to avoid multiple recognitions in a short time
                    current_time = time.time()
                    last_recognition = last_recognition_time.get(name, 0)

                    if current_time - last_recognition > RECOGNITION_COOLDOWN:
                        store_employee_timings(name, json_to_export['date'], json_to_export['hour'])
                        last_recognition_time[name] = current_time    
                else:
                    name = "Unknown"
                    y1, x2, y2, x1 = faceloc
                    # since we scaled down by 4 times
                    y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.rectangle(frame, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
                    cv2.putText(frame, name, (x1 + 6, y2 - 5), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
            ret, buffer = cv2.imencode('.jpg', frame)
            frame= buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
def start_recognition_thread():
    global run_recognition
    run_recognition = True
    while run_recognition:
        # Call the gen_frames() function here
        gen_frames()
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
run_recognition = True
@app.route('/check_recognition', methods=['GET'])
def check_recognition():
    try:
        name = json_to_export.get('name', 'Unknown')
        hour = json_to_export.get('hour', '')
        recognized = json_to_export.get('recognized', False)
        attendance_taken = json_to_export.get('attendance_taken', False)

        return jsonify({
            'name': name,
            'hour': hour,
            'recognized': recognized,
            'attendance_taken': attendance_taken,
            'recognition_running': run_recognition  # Add the recognition status
        })

    except Exception as e:
        print("Error while checking recognition", str(e))
        return jsonify({'error': 'Error while checking recognition'})

@app.route('/acknowledge_attendance', methods=['GET'])
def acknowledge_attendance():
    try:
        json_to_export['recognized'] = False  # Reset the recognition status
        json_to_export['attendance_taken'] = False  # Reset the attendance taken status
        run_recognition = False  # Stop the recognition process

        return jsonify({'acknowledged': True})
    except Exception as e:
        print("Error while acknowledging attendance", str(e))
        return jsonify({'error': 'Error while acknowledging attendance'})

@app.route('/add_employee', methods=['POST'])
def add_employee():
    try:
        # Get the picture and person's name from the request
        image = request.files['image']
        name = request.form['name']
        email = request.form['email']
        phone_number = request.form['phoneNumber']
        department = request.form['department']
        connection = psycopg2.connect(user="postgres",
                                    password="123456",
                                    host="localhost",
                                    port="5432",
                                    database="students")
        cursor = connection.cursor()
        insert_query = '''
        INSERT INTO studentsdata (name, email, phonenumber, department)
        VALUES (%s, %s, %s, %s);
        '''
        cursor.execute(insert_query, (name, email, phone_number, department))
        connection.commit()
        # Save the image with the person's name in the 'myimages' folder
        file_path = os.path.join("myimages", f"{name}.jpg")
        image.save(file_path)
        
        recognition_thread = threading.Thread(target=start_recognition_thread)
        recognition_thread.start()
        answer = 'New employee successfully added'
        print(answer)
    except Exception as e:
        answer = 'Error while adding new employee. Please try later...'
        print(answer, str(e))
    return jsonify(answer)
# Update the Flask route to accept a date parameter

@app.route('/attendance/<string:date>', methods=['GET'])
def get_attendance_for_date(date):
    try:
        connection = psycopg2.connect(user="postgres",
                                    password="123456",
                                    host="localhost",
                                    port="5432",
                                    database="students")
        cursor = connection.cursor()

        # Query to get the attendance for the specified date
        get_attendance_query = f"SELECT name, entry_time, exit_time FROM students WHERE date = '{date}'"
        cursor.execute(get_attendance_query)
        attendance_data = cursor.fetchall()

        # Format the data into a list of dictionaries
        attendance_list = []
        for row in attendance_data:
            name, entry_time, exit_time = row
            attendance_list.append({
                'name': name,
                'entry_time': entry_time.strftime('%H:%M:%S') if entry_time else None,
                'exit_time': exit_time.strftime('%H:%M:%S') if exit_time else None
            })

        return jsonify(attendance_list)

    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return jsonify({'error': 'Failed to fetch attendance data'})

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
@app.route('/attendancebyname/<string:name>', methods=['GET'])
def get_attendance_for_name(name):
    try:
        connection = psycopg2.connect(user="postgres",
                                    password="123456",
                                    host="localhost",
                                    port="5432",
                                    database="students")
        cursor = connection.cursor()

        # Query to get the attendance for the specified employee (name)
        get_attendance_query = f"SELECT date, entry_time, exit_time FROM students WHERE name = '{name}'"
        cursor.execute(get_attendance_query)
        attendance_data1 = cursor.fetchall()

        # Format the data into a list of dictionaries
        attendance_list1 = []
        for row in attendance_data1:
            date, entry_time, exit_time = row
            attendance_list1.append({
                'date': date,
                'entry_time': entry_time.strftime('%H:%M:%S') if entry_time else None,
                'exit_time': exit_time.strftime('%H:%M:%S') if exit_time else None
            })

        return jsonify(attendance_list1)

    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return jsonify({'error': 'Failed to fetch attendance data'})

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

@app.route('/absentees/<date>', methods=['GET'])
def get_absentees_by_date(date):
    try:
        connection = psycopg2.connect(user="postgres",
                                    password="123456",
                                    host="localhost",
                                    port="5432",
                                    database="students")
        cursor = connection.cursor()

        # Get the list of all registered students from the studentsdata table
        fetch_registered_query = '''
        SELECT name, email, phonenumber, department FROM studentsdata;
        '''
        cursor.execute(fetch_registered_query)
        registered_students = cursor.fetchall()

        # Get the list of all students who have marked their attendance on the given date
        fetch_attendance_query = '''
        SELECT name FROM students WHERE date = %s;
        '''
        cursor.execute(fetch_attendance_query, (date,))
        attendance_list = cursor.fetchall()
        attendance_set = set([student[0] for student in attendance_list])

        # Find the names of absentees by comparing registered students with those who marked attendance on the given date
        absentees = []
        for student in registered_students:
            if student[0] not in attendance_set:
                absentees.append({
                    'name': student[0],
                    'email': student[1],
                    'phonenumber': student[2],
                    'department': student[3]
                })

        # Return the list of absentees for the given date
        return jsonify(absentees)

    except Exception as e:
        answer = 'Error while fetching absentees. Please try later...'
        print(answer, str(e))
        return jsonify([])  # Return an empty list in case of an error
@app.route('/total_employees', methods=['GET'])
def get_total_employees():
    try:
        with psycopg2.connect(
                user="postgres",
                password="123456",
                host="localhost",
                port="5432",
                database="students"
            ) as connection:
            cursor = connection.cursor()

        # Query to get the total number of employees in studentsdata table
        total_employees_query = '''
        SELECT COUNT(*) FROM studentsdata;
        '''
        cursor.execute(total_employees_query)
        total_employees = cursor.fetchone()[0]

        return jsonify({'total_employees': total_employees})

    except Exception as e:
        answer = 'Error while fetching total employees. Please try later...'
        print(answer, str(e))
        return jsonify({'error': 'Error fetching total employees'})

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")

if __name__=='__main__':
    app.run(debug=True,port=5001)