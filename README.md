# csic-api

> This is CSIC API for Cibo App! Nothing goes to waste

## Comment/Notes

- [x] Finished (fetchable)
- [ ] Ongoing

## Tables

### Posts

| Name | Type | Description |

| ----------- | ------ | --------------------------------------- |

| id | int4 | Auto generated Serial by postgreSQL |

| user_id | int4 | Referenced to users(id) |

| item_name | int4 | Name of the item or brand it has |

| image_url | string | Cloudinary URL for storing item's image |

| buy_date | Date | Date at time |

| exp_date | Date | Auto generated Serial by postgreSQL |

| category | string | category which this item belongs to |

| description | string | Details about the item |

| tag | string | 'AVAILABLE', 'UNAVAILABLE', 'EXPIRED' |

### requests

| Name | Type | Description |

| ------------ | ---- | ---------------------------------------------------- |

| id | int4 | Auto generated Serial by postgreSQL |

| user_id | int4 | Referenced to users(id) whose get the request |

| requester_id | int4 | Referenced to users(id) whose request the item |

| post_id | int4 | Referenced to posts(id) which item that is requested |

### users

| Name | Type | Description |

| --------- | ------------- | ------------------------------------------------------------------------------- |

| id | number | Auto generated Serial by postgreSQL |

| email | string | For future purpose verification, forgot password, anti-spam | -> can change |

| username | string | username of account which has passed frontend verification |

| full_name | string | Name for Account identifier |

| password | string | password of account which has passed frontend verification, Hash(password+salt) |

| telephone | string | Number of phone that can be called |

| location | string | Places the user live in |

| avatar | string | Cloudinary URL |

| gender | string | 'MALE', 'FEMALE', 'OTHER' |

| following | Array[number] | List of userId whoever this user follow |

| follower | Array[number] | List of userId whoever follows this user |

## Authentication

### Sign Up (SIGN UP SCENE)

- [x] Finished (fetchable)

| A | B |

| ----------- | --------------------------------- |

| FETCH | /api/auth/sign-up |

| METHOD | POST |

| Description | Endpoint used for adding new user |

Request Header

```
Content-Type: multipart/form-data
```

Request Body

```
{
email: string,
username: string,
password: string, *checked before go to server min. 6 char, etc.
full_name: string,
telephone: string,
location: string,
image: string, *optional
}

```

Response Value

```
{
success: boolean,
data: [
{
id : number,
email : string,
username : string,
full_name : string,
telephone: string,
location: string,
avatar: string | null,
}
],
message : "full_name has been added.",
token : generated with JWT middleware, use this for session and authenticate each time fetching,
}
```

### Sign In (LOGIN SCENE)

- [x] Finished (fetchable)

| A | B |

| ----------- | ------------------------------------------ |

| FETCH | /api/auth/sign-in |

| METHOD | POST |

| Description | Endpoint used for login from user or admin |

Request Header

```
Content-Type: application/json
```

Request Body JSON

```
{
credential: string, *can login with email or username
password: string,
}
```

Response Value

```
{
success: boolean,
data: [

{

id : number,

email : string,

username : string,

full_name : string,

telephone: string,

location: string,

avatar: string | null,

}

],

message : "full_name has been added.",

token : generated with JWT middleware, use this for session and authenticate each time fetching,

}

```

<br/>

# Pages

- [x] Home

| A | B |

| ----------- | --------------------------------------- |

| FETCH | /api/page/home |

| METHOD | GET |

| Description | Page's Endpoint to fetch data from home |

Request Header

```



Content-Type: application/json

authorization : <token app get when login>



```

Response Value

{

success: boolean,

data: [

{

id: number,

user_id: number,

item_name: string,

image_url: string,

buy_date: string,

exp_date: string,

category: string,

description: string,

tag: string (AVAILABLE, UNAVAILABLE, EXPIRED),

timestamp: string,

username: string,

full_name: string,

location: string,

avatar: string | null,

}

],

message : "Successfully get home data"

}

<br/>

- [x] My Profile (MY PROFILE SCENE)

| A | B |

| ----------- | -------------------------------------- |

| FETCH | /api/page/profile/ |

| METHOD | GET |

| Description | Page's Endpoint used to get my profile |

Request Header

```



Content-Type: application/json

authorization : <token app get when login>



```

Response Value

```



{

success : boolean,

data : [

{

id: number,

email: string,

username: string,

full_name: string,

telephone: string,

location: string,

avatar: string | null,

gender: string,

following: Array[id],

follower: Array[id],

}

],

message : "Successfully retrieve my profile"

}



```

<br/>

- [x] User Profile (USER PROFILE SCENE)

| A | B |

| ----------- | ---------------------------------------- |

| FETCH | /api/page/profile/:id |

| METHOD | GET |

| Description | Page's Endpoint used to get user profile |

Request Header

```



Content-Type: application/json

authorization : <token app get when login>



```

Response Value

```



{

success : boolean,

data : [

{

id: number,

email: string,

username: string,

full_name: string,

telephone: string,

location: string,

avatar: string | null,

gender: string,

following: Array[id],

follower: Array[id],

}

],

message : "Successfully retrieve user profile"

}



```

<br/>

# Features

- [x] Add Post (ADD POST SCENE)

| A | B |

| ----------- | ------------------------------------- |

| FETCH | /api/feature/add-post |

| METHOD | POST |

| Description | Feature's Endpoint used to add a post |

Request Header

```



Content-Type: multipart/form-data

authorization : <token app get when login>



```

Request Body JSON

```



{

image: string,

item_name: string,

buy_date: string, *YYYY-MM-DD

exp_date: string, *YYYY-MM-DD

category: string,

description: string,

tag: string, \*'AVAILABLE' OR 'EXPIRED'

}



```

Response Value

```



{

success : boolean,

data : [

{

id: number,

user_id: number,

item_name: string,

image_url: string,

item_name: string,

buy_date: string, *YYYY-MM-DD

exp_date: string, *YYYY-MM-DD

category: string,

description: string,

tag: string, *'AVAILABLE' OR 'EXPIRED'

}

],

message : "Successfully insert a Post!"

}



```

<br/>

```



- [x] Edit Profile (EDIT PROFILE SCENE)



| A | B |

| ----------- | ------------------------------------- |

| FETCH | /api/feature/edit-profile |

| METHOD | POST |

| Description | Feature's Endpoint used to add a post |



Request Header



```

Content-Type: multipart/form-data

authorization : <token app get when login>

```



Request Body JSON



```

{

image: string,

full_name: string,

telephone: string,

location: string,

gender: string (MALE, FEMALE, OTHER)

}

```



Response Value



```

{

success : boolean,

data : [

{

id: number,

email: string,

username: string,

full_name: string,

telephone: string,

location: string,

avatar: string | null,

gender: string,

following: Array[id],

follower: Array[id],

}

],

message : "User profile has been changed"

}

```

```
