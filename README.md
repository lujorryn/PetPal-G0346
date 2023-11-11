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
Brief app description

-----
**ENDPOINTS**

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