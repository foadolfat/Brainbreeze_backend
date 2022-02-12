
# List of API endpoints:
- ## [user](#user-end-point)
- ## [class](#class-end-points)
- ## [lesson](#lesson-end-points)
- ## [module](#module-end-points)

# How to use API endpoints:

## User end point

### POST
- Creates new user
/api/user
body:
{
    "user_name": "string",
    "user_password": "string",
    "user_email": "string",
    "user_type": "string",
}

### GET 
- Retrieve user information such as email, type and name
/api/user/[user_id]
OR
[URL]/api/user
body:
{
	"user_email":"string"
}

### PUT
- Update existing user
/api/user/[user_id]

### DELETE
- Delete existing user
/api/user/[user_id]


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
- Update existing lesson
/api/lesson/[lesson_id]
body:
{
	"lesson_name":"string",
}


### DELETE
- Delete existing lesson
/api/lesson/[lesson_id]
body:
{
	"module_id":"integer (module_id)"
}

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