# CSC309 Group_0346 PetPal Overview

## Model Entity Relationship Diagram
TBD in case we make changes to the model laters, will add a finalized version once all apps are complete

## Simple JWT Token-based Authentication
We use simple JWT's TokenObtainPairView to implement our login function.

-----
**LOGIN**</br>
**Endpoint:** `/api/token/`</br>
**Description:** Generates a refresh and an access token if given the correct email and password combination.</br>
**Methods:** `POST`</br>
**Required Payload:** `email`, `password`</br>
**Permissions:** Any user</br>
**ERRORS:**
- `400 Bad Request`: Missing `email` and/or `password`
- `401 Unauthorized`: Incorrect username and password combination

**SUCCESS:** Return a refresh token and an access token. Example:</br>
```
{   "refresh": "eyJhbGciOiJIUzI1NiIs...",
    "access": "eyJhbGciOiJIUzI1NiIs..."   }
```

---

## The accounts app

The accounts app defines a custom PetPalUser model derived from Django's AbstractUser that includes all extra fields specified in the ERD diagram. The app includes signup (creating a new PetPalUser) and delete account functions.

-----
**SIGNUP**</br>
**Endpoint:** `/api/accounts/new-account`</br>
**Description:** Creates a shelter account (new PetPalUser) if `account_type` is `shelter`, otherwise create a seeker account.</br>
**Methods:** `POST`</br>
**Required Payload:** `email`, `password`, `confirm_password`, `account_type`</br>
**Optional Payload:** `first_name`, `last_name`</br>
**Permissions:** Any user</br>
**ERRORS:**
- `400 Bad Request`: 
    - Invalid email address
    - Missing any field in required payload
    - `password` and `confirm_password` don't match
    - User with this email already exists

**SUCCESS:** Return a message that indicates user \<user_id\> SEEKER/SHELTER successfully created. Example:</br>
```
{   "msg": "User 7: SEEKER successfully created"   }
```

-----
**DELETE ACCOUNT**</br>
**Endpoint:** `/api/accounts/<int:account_id>`</br>
**Description:** Delete an account if account is owned by the user and all its owned items (e.g. seeker: applications shelter: petlistings etc) </br>
**Methods:** `DELETE`</br>
**Permissions:** Account owner</br>
**ERRORS:**
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)
- `403 Forbidden`: 
    - `account_id` does not match with `request.user.id`

**SUCCESS:** Return a message that indicates user \<user_id\> deleted. Example:</br>
```
{   "msg": "User 1 deleted"   }
```

-----


## The seekers app
Brief app description

-----
**ENDPOINTS**

-----


## The shelters app
Brief app description

-----
**ENDPOINTS**

-----


## The petlistings app
Brief app description

-----
**ENDPOINTS**

-----


## The applications app
Allows the user to view, create, and modify applications for a petlisting.

Shelters can view all of the applications for a petlisting. 

Seekers can view their applications only.

-----
### ENDPOINTS

**Endpoint:** </br>
`/api/application`

**Description:** </br>
Create an application for a petlisting or view a list of applications

**Methods:** </br>
`GET`, `POST`


### POST request:

**Required Payload:** </br>
- `first_name`, `last_name`, `address`, `phone`, `email`, `contact_pref`, `pet_number`, `has_children`, `experience`, `residence_type`, `status`, `petlisting_id`

**Optional Payload:**</br>
- None

**Permissions:**
- Shelter:
    - must be authenticated

- Seeker:
    - must be authenticated

**ERRORS:**
- `400 Bad Request`:
  - Invalid data in the payload.
  - User invalid (when trying to retrieve the current user from the database).
  - PetListing invalid (when trying to retrieve the petlisting from the database).
  - PetListing unavailable (when the status of the petlisting is not 'AV' - available).

- `401 Unauthorized`:
  - Authentication credentials were not provided (user not logged in).

**SUCCESS:** </br>
Return a redirect url and success status code:

```
{
    "redirect_url": "/api/applications/<application_id>", "status": 201
}
```

### GET request:

**Required Payload:** </br>
- None

**Optional Payload:**</br>
- None

**Permissions:**
- Shelter:
    - must be authenticated

- Seeker:
    - must be authenticated


**ERRORS:**
- `400 Bad Request`:
  - Invalid status or sort option provided in the query parameters.
  - Invalid user role (when the user role is not 'SHELTER' or 'SEEKER').
  - Sorting option not supported.

- `401 Unauthorized`:
  - Authentication credentials were not provided (user not logged in).

**SUCCESS:** 
- Shelter:
    - Return a paginated list of the applications for all of the shelter's pet listings with a status 200

- Seeker:
    - Return a paginated list of the user's applications with a status 200

```
{
    "count": 35,
    "next": "http://localhost:8000/api/applications?page=2",
    "previous": null,
    "results": {
        "data": [
            {
                "id": 37,
                "first_name": "John",
                "last_name": "Doe",
                "address": "123 Main St",
                "phone": "555-1234-99999999999999999",
                "email": "shelter1@example.com",
                "contact_pref": "P",
                "pet_number": 2,
                "has_children": false,
                "experience": "EX",
                "residence_type": "C",
                "status": "P",
                "created_time": "2023-11-12T01:09:20.055224Z",
                "last_updated": "2023-11-12T01:09:20.055265Z",
                "seeker": 4,
                "shelter": 4,
                "petlisting": 1
            },
            ...
            ]
    }
}
```
---

**Endpoint:** </br>
`/api/applications/pet/<int:pet_id>`

**Description:** </br>
List all applications for a pet listing (pet_id)

**Methods:** </br>
`GET`


### GET request:

**Required Payload:** </br>
- None

**Optional Payload:**</br>
- None

**Permissions:**
- Shelter:
    - must be authenticated

- Seeker:
    - not allowed


**ERRORS:**
- `400 Bad Request`:
  - Invalid pet_id was provided.

- `401 Unauthorized`:
  - Shelter does not own the pet listing.

**SUCCESS:** 
- Return a paginated list of the applications for a petlisting with a status 200.

    
```
{
    "count": 35,
    "next": "http://localhost:8000/api/applications/pet/1?page=2",
    "previous": null,
    "results": {
        "data": [
            {
                "id": 37,
                "first_name": "John",
                "last_name": "Doe",
                "address": "123 Main St",
                "phone": "555-1234-99999999999999999",
                "email": "shelter1@example.com",
                "contact_pref": "P",
                "pet_number": 2,
                "has_children": false,
                "experience": "EX",
                "residence_type": "C",
                "status": "P",
                "created_time": "2023-11-12T01:09:20.055224Z",
                "last_updated": "2023-11-12T01:09:20.055265Z",
                "seeker": 4,
                "shelter": 4,
                "petlisting": 1
            },
            ...
            ]
    }
}
```

---

**Endpoint:** </br>
`/api/applications/<int:app_id>`

**Description:** </br>
View or Edit the specified application

**Methods:** </br>
`GET`, `PUT`


### GET request:

**Required Payload:** </br>
- None

**Optional Payload:**</br>
- None

**Permissions:**
- Shelter:
    - must be authenticated and own the application

- Seeker:
    - must be authenticated and own the application


**ERRORS:**
- `400 Bad Request`:
  - Invalid app_id was provided.

- `401 Unauthorized`:
  - Shelter does not own the pet listing for the application
  - Seeker is not the author of the application

**SUCCESS:** 
- Return the details of the application with a status 200.

    
```
{
    "data": {
        "id": 12,
        "first_name": "John",
        "last_name": "Doe",
        "address": "123 Main St",
        "phone": "555-1234",
        "email": "shelter1@example.com",
        "contact_pref": "P",
        "pet_number": 2,
        "has_children": false,
        "experience": "EX",
        "residence_type": "C",
        "status": "D",
        "created_time": "2023-11-11T15:12:47.599277Z",
        "last_updated": "2023-11-11T15:13:17.139519Z",
        "seeker": 4,
        "shelter": 4,
        "petlisting": 1
    }
}
```


### PUT request:

**Required Payload:** </br>
- `status`

**Optional Payload:**</br>
- None

**Permissions:**
- Shelter:
    - must be authenticated and own the application

- Seeker:
    - must be authenticated and own the application


**ERRORS:**
- `400 Bad Request`:
  - Invalid app_id was provided.
  - Seeker wanted to update the application with a status other than 'w'
  - Shelter wanted to update the application with a status other than 'A' or 'D'

- `401 Unauthorized`:
  - Shelter does not own the pet listing for the application
  - Seeker is not the author of the application

**SUCCESS:** 
- Return a redirect url and success status code:

```
{
    "redirect_url": "/api/applications/<application_id>", "status": 201
}
```

-----


## The comments app

The accounts app defines a Comment model with its fields specified in the ERD diagram. The app implements the following 5 endpoints that support creating, listing and viewing comments:

-----
**CREATE COMMENT**</br>
**Endpoint:** `/api/comments`</br>
**Description:** Create a comment regarding an application or a shelter</br>
**Methods:** `POST`</br>
**Required Payload:** `is_review`, `content`, `recipient_email`</br>
**Optional Payload:** `rating`, `application` (required if `is_review=True`)</br>
**Permissions:**
- Application comments: application seeker and application's petlisting's owner
- Shelter reviews: Any logged in user

**ERRORS:**
- `400 Bad Request`: 
    - SEEKER-SEEKER comments and SHELTER-SHELTER comments not supported
    - Missing any field in required payload
    - Application comment with no valid application_id
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)
    - Application comments: User does not match permissions specified above

**SUCCESS:** Return a message that indicates Review/Comment created and returns comment details. Example:</br>
```
{
    "msg": "Review Created",
    "data": {
        "To": "seeker1@example.com",
        "From": "shelter1@example.com",
        "Message": "Awesome!",
        "rating": 5
    }
}
```

-----
**Endpoint:** `/api/comments/applications`</br>
**Description:** List all comments of user's all applications with pagination by application supported</br>
**Methods:** `GET`</br>
**Fields:** `id`, `content`, `created_time`, `rating=null`, `is_author_seeker`, `seeker(email display)`, `shelter(email display)`, `is_review=False`, `application(id display)`</br>
**Permissions:** Logged in user can view their own application comments</br>
**ERRORS:**
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)

**SUCCESS:** Return a page indicator (current page, has_next, has_previous) and all the data fields.</br>

-----
**Endpoint:** `/api/comments/applications/<int:app_id>`</br>
**Description:** List all comments of a user's specific application with pagination supported</br>
**Methods:** `GET`</br>
**Fields:** `id`, `content`, `created_time`, `rating=null`, `is_author_seeker`, `seeker(email display)`, `shelter(email display)`, `is_review=False`, `application(id display)`</br>
**Permissions:** Not the application seeker or the application's petlisting owner</br>
**ERRORS:**
- `400 Bad Request`: 
    - Application with `app_id` does not exist
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)
    - Not the application seeker or the application's petlisting owner

**SUCCESS:** Return a page indicator (current page, has_next, has_previous) and all the data fields.</br>

-----
**Endpoint:** `/api/comments/applications/<int:msg_id>`</br>
**Description:** View a comment's contents</br>
**Methods:** `GET`</br>
**Fields:** `id`, `content`, `created_time`, `rating`, `is_author_seeker`, `seeker(email display)`, `shelter(email display)`, `is_review`, `application(id display)`</br>
**Permissions:** Author/Recipient (seeker or shelter of Comment object) of comment</br>
**ERRORS:**
- `400 Bad Request`: 
    - Comment with `msg_id` does not exist
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)
    - Not author/recipient

**SUCCESS:** Return a page indicator (current page, has_next, has_previous) and all the data fields.</br>
```
{
    "data": {
        "id": 1,
        "content": "I would love to see Buddy in person!",
        "created_time": "2023-11-10T19:33:02.452885Z",
        "rating": null,
        "is_author_seeker": true,
        "seeker": "seeker1@example.com",
        "shelter": "shelter1@example.com",
        "is_review": false,
        "application": 1
    }
}
```

-----
**Endpoint:** `/api/comments/shelter/<int:shelter_id>`</br>
**Description:** List all comments of a shelter with pagination supported</br>
**Methods:** `GET`</br>
**Fields:** `id`, `content`, `created_time`, `rating=null`, `is_author_seeker`, `seeker(email display)`, `shelter(email display)`, `is_review=False`, `application(id display)`</br>
**Permissions:** Any logged in user</br>
**ERRORS:**
- `400 Bad Request`: 
    - Shelter with `shelter_id` does not exist
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)

**SUCCESS:** Return a page indicator (current page, has_next, has_previous) and all the data fields.</br>

-----

## The notification app
Brief app description

-----
**ENDPOINTS**

-----