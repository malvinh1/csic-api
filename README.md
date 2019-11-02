# csic-api

> This is CSIC API for Cibo App! Nothing goes to waste

## Comment/Notes

### Comment/Notes

- [x] Finished (fetchable)
- [ ] Ongoing

# Tables

## Posts

| Name        | Type   | Description                             |
| ----------- | ------ | --------------------------------------- |
| id          | int4   | Auto generated Serial by postgreSQL     |
| user_id     | int4   | Referenced to users(id)                 |
| item_name   | int4   | Name of the item or brand it has        |
| image_url   | string | Cloudinary URL for storing item's image |
| buy_date    | Date   | Date at time                            |
| exp_date    | Date   | Auto generated Serial by postgreSQL     |
| category    | string | category which this item belongs to     |
| description | string | Details about the item                  |
| tag         | string | 'AVAILABLE', 'UNAVAILABLE', 'EXPIRED'   |

### Table requests

| Name         | Type | Description                                          |
| ------------ | ---- | ---------------------------------------------------- |
| id           | int4 | Auto generated Serial by postgreSQL                  |
| user_id      | int4 | Referenced to users(id) whose get the request        |
| requester_id | int4 | Referenced to users(id) whose request the item       |
| post_id      | int4 | Referenced to posts(id) which item that is requested |

### Table users

| Name         | Type          | Description                                                                     |
| ------------ | ------------- | ------------------------------------------------------------------------------- |
| id           | number        | Auto generated Serial by postgreSQL                                             |
| email        | string        | For future purpose verification, forgot password, anti-spam                     | -> can change |
| username     | string        | username of account which has passed frontend verification                      |
| full_name    | string        | Name for Account identifier                                                     |
| password     | string        | password of account which has passed frontend verification, Hash(password+salt) |
| phone_number | string        | Number of phone that can be called                                              |
| location     | string        | Places the user live in                                                         |
| avatar       | string        | Cloudinary URL                                                                  |
| gender       | string        | 'MALE', 'FEMALE', 'OTHER'                                                       |
| following    | Array<number> | List of userId whoever this user follow                                         |
| follower     | Array<number> | List of userId whoever follows this user                                        |

<br/>

# Authentication

- [x] Sign Up (SIGNUP SCENE)

| A           | B                                 |
| ----------- | --------------------------------- |
| FETCH       | /api/auth/sign-up                 |
| METHOD      | POST                              |
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
  phone_number: string,
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
      phone_number: string,
      location: string,
      avatar: string | null,
    }
  ],
  message : "full_name has been added.",
  token : generated with JWT middleware, use this for session and authenticate each time fetching,
}

],

message : "full_name has been added.",

token : generated with JWT middleware, use this for session and authenticate each time fetching,

}

```

<br/>

- [x] Sign In (LOGIN SCENE)

| A           | B                                          |
| ----------- | ------------------------------------------ |
| FETCH       | /api/auth/sign-in                          |
| METHOD      | POST                                       |
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
  success: boolean,
  data: [
    {
      id : number,
      email : string,
      username : string,
      full_name : string,
      phone_number: string,
      location: string,
      avatar: string | null,
    }
  ],
  message : "full_name has been added.",
  token : generated with JWT middleware, use this for session and authenticate each time fetching,
}

],

message : "full_name has been added.",

token : generated with JWT middleware, use this for session and authenticate each time fetching,

}

```

<br/>

# Pages

<br/>

# Features

- [x] Add Post (ADD POST SCENE)

| A           | B                                     |
| ----------- | ------------------------------------- |
| FETCH       | /api/feature/add-post                 |
| METHOD      | POST                                  |
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


| A           | B                                       |
| ----------- | ----------------------------------------|
| FETCH       | /api/feature/edit-profile               |
| METHOD      | POST                                    |
| Description | Feature's Endpoint used to edit profile |


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
