
# List of API endpoints:
- ## [user](#user-end-point)
- ## [class](#class-end-points)
- ## [lesson](#lesson-end-points)
- ## [module](#module-end-points)

# How to use API endpoints:

## User end point

### POST
- Creates new user</br>

/api/user</br>
</br>
req.body:</br>
{</br>
        "user_name": "string",</br>
        "user_password": "string",</br>
        "user_email": "string",</br>
        "user_type": "string",</br>
}</br>
res:</br>
{</br>
        message:boolean (true if user creation successful)
}</br>
</br>

### GET 
- Sign user in</br>
/api/user/signin</br>
</br>
req.body:</br>
{</br>
        "user_email":"string",</br>
        "user_password":"string"
}</br>
res:</br>
{</br>
        auth:boolean(true if authenticated),</br>
        token:jwt token,</br>
        user_email:string,</br>
        user_name:string,</br>
        user_type:string,</br>
        user_id:int</br>
}</br>
</br>

- Retrieve user information such as email, type and name</br>

/api/user/[user_id]</br>
</br>
req.body:</br>
{</br>
        "user_email":"string",</br>
        "user_name":"string"</br>
}</br>
req.header:</br>
{</br>
        "token":"string (jwt token saved from signing in)"</br>
}</br>
</br>
res:</br>
{</br>
        user_id:int,</br>
        user_email:string,</br>
        user_name:string,</br>
        user_type:string</br>
}</br>


### PUT
- Update existing user's email and/or username</br>

/api/user/update/[user_id]</br>
</br>
req.header:</br>
{</br>
        "token":"string (jwt token saved from signing in)"</br>
}</br>
</br>


### DELETE
- Delete existing user</br>

/api/user/remove/[user_id]</br>
req.header:</br>
{</br>
        "token":"string (jwt token saved from signing in)"</br>
}</br>
</br>
================================================================================================</br>
## Class end points

### POST
- Creates new class
/api/class
body:
{
    "class_id": "integer",
    "class_name": "string",
    "class_descrip": "string",
    "user_class": "integer (user_id)",
}

### GET 
- Retrieve class information such as description and name
/api/class/[class_id]
body:
{
	"user_class":"integer (user_id)"
}

### PUT
- Update existing class
/api/class/[class_id]
body:
{
	"class_name":"string",
	"user_class":"user_id (integer)"
}


### DELETE
- Delete existing user
/api/class/[class_id]
body:
{
	"user_class":"integer (user_id)"
}


================================================================================================</br>
## Lesson end points

### POST
- Creates new lesson
/api/lesson
body:
{
    "lesson_id": "integer",
    "lesson_name": "string",
    "lesson_descrip": "string",
    "module_id": "integer (module)id)",
}

### GET 
- Retrieve lesson information such as description and name
/api/lesson/[lesson_id]


### PUT
- Update existing lesson</br>
/api/lesson/[lesson_id]</br>
body:
{
	"lesson_name":"string",
}


### DELETE
- Delete existing lesson</br>
/api/lesson/[lesson_id]
body:
{
	"module_id":"integer (module_id)"
}

================================================================================================</br>
## Module end points

### POST
- Creates new module
/api/class
body:
{
    "module_id": "integer",
    "module_name": "string",
    "module_descrip": "string",
    "class_id": "integer",
}

### GET 
- Retrieve lesson information such as description and name
/api/class/[module_id]


### PUT
- Update existing lesson
/api/module/[module_id]
body:
{
	"module_name":"string",
	"module_description":"string"
}


### DELETE
- Delete existing lesson
/api/class/[module_id]
body:
{
	"class_id":"integer"
}
