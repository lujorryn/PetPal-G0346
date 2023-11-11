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
The seekers app corresponds to users looking for a pet. The app provides the functions to view and update a user's own profile, view their favorite pets, and add/delete pets from their favorites.  

-----
**ALL SEEKER USERS**</br>
**Endpoint:** `/api/seekers`</br>
**Description:** Forbids anyone from looking at the list of all seeker users. </br>
**Methods:** `GET`</br>
**Permissions:** None </br>
**ERRORS:**
- `403 Forbidden`
    - Every user, authenticated or not, should receive this error.
-----
**USER DETAIL VIEW**</br>
**Endpoint:** `/api/seekers/<int:account_id>`</br>
**Description:** Get the details of a seeker and update the user's data if needed. </br>
**Methods:** `GET` `PUT`</br>
**Permissions:** Account owner has permissions for GET and PUT requests, only GET for shelters with an active application</br>
**ERRORS:**
- `401 Unauthorized`
    - Authentication credentials were not provided (user not logged in).
- `403 Forbidden`: 
    - `account_id` does not match with `request.user.id`
- `400 Bad Request`: 
    - User tried to update a field incorrectly.
- `404 Forbidden`: 
    - Account with `account_id` does not exist.

**SUCCESS:** Return the data of \<account_id\>. Example:</br>
```
{
    "msg": "Seeker details",
    "user_data": {
        "email": "seeker2@example.com",
        "address": "",
        "city": "",
        "province": "",
        "postal_code": "",
        "phone": "",
        "avatar": null,
        "is_notif_comment": true,
        "is_notif_status": true,
        "is_notif_petlisting": true
    },
    "fav_pets": []
}
```

-----
**USER PET FAVORITES**</br>
**Endpoint:** `/api/seekers/<int:account_id>/favorites`</br>
**Description:** Get the list of favorite pets by the user with id `account_id` </br>
**Methods:** `GET`</br>
**Permissions:** Account owner only</br>
**ERRORS:**
- `401 Unauthorized`
    - Authentication credentials were not provided (user not logged in).
- `403 Forbidden`: 
    - `account_id` does not match with `request.user.id`
- `404 Not Found`: 
  - account with `account_id` not found

**SUCCESS:** Return a list with \<account_id\> favorites. Example:</br>
```
{
    "page": {
        "current": 1,
        "has_next": false,
        "has_previous": false
    },
    "msg": "seeker1@example.com Favorites",
    "data": [
        {
            "id": 1,
            "name": "Buddy",
            "category": "D",
            "breed": "Golden Retriver",
            "age": 3,
            "gender": "M",
            "size": "L",
            "status": "",
            "med_history": "None",
            "behaviour": "Friendly",
            "special_needs": "",
            "description": "A very friendly dog."
        }
    ]
}
```

-----
**ADD/DELETE FAVORITES**</br>
**Endpoint:** `/api/seekers/<int:account_id>/favorites/<int:pet_id>`</br>
**Description:** Add or delete a pet with `pet_id` on `account_id`'s favorites </br>
**Methods:** `POST`, `DELETE`</br>
**Permissions:** Account owner only</br>
**ERRORS:**
- `401 Unauthorized`
    - Authentication credentials were not provided (user not logged in).
- `403 Forbidden`: 
    - `account_id` does not match with `request.user.id`.
- `404 Not Found`: 
  - account with `account_id` or pet with `pet_id` not found
- `409 Conflict`
  - `pet_id` is already in favorites (add), or is not in favorites (delete)

**SUCCESS:** Return a message of add/delete successful and `pet_id` Examples:</br>
```
{ "msg": "Added 4 to favorites" }
```
```
{ "msg": "Removed 4 from favorites" }
```

-----


## The shelters app
Brief app description

-----
**ENDPOINTS**

-----


## The petlistings app
Brief app description

-----
The petlisting app defines a PetListing model with its fields specified in the ERD diagram. The app implements the following 5 endpoints that support creating, updating, viewing, and deleting Petlistings:

-----
**GET Petlisting**</br>
**Endpoint:** `/api/petlistings`</br>
**Description:** Get a petlisting</br>
**Methods:** `GET`</br>
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

**SUCCESS:** Return a message that indicates petlisting created and returns listing details. </br>

-----
**CREATE Petlisting**</br>
**Endpoint:** `/api/petlistings`</br>
**Description:** Create a petlisting</br>
**Methods:** `POST`</br>
**Required Payload:** `name`, `category`, `gender`, `size`</br>
**Optional Payload:** `age`, `breed`, `description`, `med_history`, `behaviour`, `special_needs`</br>
**Permissions:**
- Any logged in user and is a shelter

**ERRORS:**
- `400 Bad Request`: 
    - Missing any field in required payload
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)
    - User is not a shelter

**SUCCESS:** Return a message that indicates petlisting created and returns listing details. </br>

-----
**GET Petlisting detail**</br>
**Endpoint:** `/api/petlistings/<int:pet_id>`</br>
**Description:** Get a petlisting details</br>
**Methods:** `GET`</br>
**Required Payload:** </br>
**Optional Payload:** </br>
**Permissions:**
- Any logged in user

**ERRORS:**
- `400 Bad Request`: 
    - Listing doesn't exist
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)

**SUCCESS:** Return a message that indicates success and returns listing details. </br>

-----
**PUT Petlisting detail**</br>
**Endpoint:** `/api/petlistings/<int:pet_id>`</br>
**Description:** Update a petlisting details</br>
**Methods:** `PUT`</br>
**Required Payload:** `name`, `category`, `gender`, `size`</br>
**Optional Payload:** `age`, `breed`, `description`, `med_history`, `behaviour`, `special_needs`</br>
**Permissions:**
- Any logged in user and is the shelter that created the listing

**ERRORS:**
- `400 Bad Request`: 
    - Missing any field in required payload
    - Listing doesn't exist
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)
    - User is not a shelter

**SUCCESS:** Return a message that indicates petlisting updated and returns listing details. </br>

-----
**DELETE Petlisting**</br>
**Endpoint:** `/api/petlistings/<int:pet_id>`</br>
**Description:** Delete a petlisting</br>
**Methods:** `DELETE`</br>
**Required Payload:** </br>
**Optional Payload:** </br>
**Permissions:**
- Any logged in user and is the shelter which created the listing

**ERRORS:**
- `400 Bad Request`: 
    - Listing doesn't exist
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)
    - User is not the shelter that created the listing

**SUCCESS:** Return a message that indicates petlisting is deleted</br>

-----
## The applications app
Brief app description

-----
**ENDPOINTS**

-----


## The comments app

The comments app defines a Comment model with its fields specified in the ERD diagram. The app implements the following 5 endpoints that support creating, listing and viewing comments:

-----
**CREATE COMMENT**</br>
**Endpoint:** `/api/comments`</br>
**Description:** Create a comment regarding an application or a shelter</br>
**Methods:** `POST`</br>
**Required Payload:** </br>
**Optional Payload:** `category`, `age`, `status`, `gender`, `size`, `shelter_email`, `name`</br>
**Permissions:**
- Any logged in user

**ERRORS:**
- `400 Bad Request`: 
    - Any optional field doesn't match the model's field options
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)

**SUCCESS:** Return a Json of pets that fit the filter requirements</br>
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
The notifications app defines a Notification model with its fields specified in the ERD diagram. The app implements the following 4 endpoints that support reading, updating, and deleting notifications:

-----
**GET Notification**</br>
**Endpoint:** `/api/notifications`</br>
**Description:** Get all notification</br>
**Methods:** `GET`</br>
**Required Payload:** </br>
**Optional Payload:** </br>
**Permissions:**
- User has the notifications

**ERRORS:**
- `400 Bad Request`: 

- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)

**SUCCESS:** Return a message that indicates success and returns the list of user's notifications</br>

-----
**GET Notification**</br>
**Endpoint:** `/api/notifications`</br>
**Description:** Get all notification</br>
**Methods:** `GET`</br>
**Required Payload:** </br>
**Optional Payload:** </br>
**Permissions:**
- User has the notifications

**ERRORS:**
- `400 Bad Request`: 

- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)

**SUCCESS:** Return a message that indicates success and returns the list of user's notifications</br>

-----
**GET Notification Details**</br>
**Endpoint:** `/api/notifications/<int:note_id>`</br>
**Description:** Get a specific notification</br>
**Methods:** `GET`</br>
**Required Payload:** </br>
**Optional Payload:** </br>
**Permissions:**
- User has the notification

**ERRORS:**
- `400 Bad Request`: 
    - Notification doesn't exist
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)

**SUCCESS:** Return a message that indicates success and returns the user's notification</br>

-----
**PUT Notification**</br>
**Endpoint:** `/api/notifications/<int:note_id>`</br>
**Description:** Update a specific notification to read</br>
**Methods:** `PUT`</br>
**Required Payload:** </br>
**Optional Payload:** </br>
**Permissions:**
- User has the notification

**ERRORS:**
- `400 Bad Request`: 
    - Notification doesn't exist
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)

**SUCCESS:** Return a message that indicates success</br>

-----
**DELETE Notification**</br>
**Endpoint:** `/api/notifications/<int:note_id>`</br>
**Description:** Delete a specific notification</br>
**Methods:** `DELETE`</br>
**Required Payload:** </br>
**Optional Payload:** </br>
**Permissions:**
- User has the notification

**ERRORS:**
- `400 Bad Request`: 
    - Notification doesn't exist
- `401 Unauthorized`
    - Authentication credentials were not provided. (user not logged in)

**SUCCESS:** Return a message that indicates success of deletion</br>
-----
