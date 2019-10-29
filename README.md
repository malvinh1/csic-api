# csic-api

This is CSIC API made for Cibo APP!

### Comment/Notes
- [x] Finished (fetchable)
- [ ] Ongoing 

# Table

### Table posts

| Name | Type | Description |
| ---- | ---- | ----------- |
| id  | int4 | Auto generated Serial by postgreSQL |
| user_id  | int4 | Referenced to users(id) |
| item_name  | int4 | Name of the item or brand it has |
| image_url | string | Cloudinary URL for storing item's image |
| buy_date  | Date | Date at time |
| exp_date  | Date | Auto generated Serial by postgreSQL |
| category  | Date | category which this item belongs to |
| buy_date  | Date | Auto generated Serial by postgreSQL |
| description  | string | Details about the item |
| tag  | string | 'AVAILABLE', 'UNAVAILABLE', 'EXPIRED' |

### Table requests

| Name | Type | Description |
| ---- | ---- | ----------- |
| id  | int4 | Auto generated Serial by postgreSQL |
| user_id  | int4 | Referenced to users(id) whose get the request |
| requester_id  | int4 | Referenced to users(id) whose request the item |
| post_id | int4 | Referenced to posts(id) which item that is requested |

### Table users

| Name | Type | Description |
| ---- | ---- | ----------- |
| id  | number | Auto generated Serial by postgreSQL |
| email | string UNIQUE | For future purpose verification, forgot password, anti-spam | -> can change
| username | string UNIQUE | username of account which has passed frontend verification |
| full_name | string | Name for Account identifier |
| password | string | password of account which has passed frontend verification, Hash(password+salt) |
| telephone | string | Number of phone that can be called  |
| location | string | Places the user live in |
| avatar | string | Cloudinary URL |
| gender | string | 'MALE', 'FEMALE', 'OTHER' |
| following | Array<number> | List of whoever this user follow |
| follower | Array<number> | List of whoever follows this user |

<br/>
  
# Authentication

- [X] Sign Up (SIGNUP SCENE)

| A | B |
| ----------- | ------------- |
| FETCH       | /api/auth/sign-up |
| METHOD      | POST |
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
<br/>

- [X] Sign In (LOGIN SCENE)

| A | B |
| ----------- | ------------- |
| FETCH       | /api/auth/sign-in  |
| METHOD      | POST |
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


<br/>


# Features

- [X] Add Post (ADD POST SCENE)

| A | B |
| ----------- | ------------- |
| FETCH       | /api/feature/add-post |
| METHOD      | POST |
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
  tag: string, *'AVAILABLE' OR 'EXPIRED'
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
