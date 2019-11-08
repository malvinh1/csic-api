# csic-api

> This is CSIC API for Cibo App! Nothing goes to waste

## Comment/Notes

- [x] Finished (fetchable)
- [ ] Ongoing

## Tables

### posts

| Name        | Type   | Description                             |
| ----------- | ------ | --------------------------------------- |
| id          | int4   | Auto generated Serial by postgreSQL     |
| user_id     | int4   | Reference to users(id)                  |
| item_name   | string | Name or brand of the item               |
| image       | string | Cloudinary URL for storing item's image |
| buy_date    | Date   | Date at time                            |
| exp_date    | Date   | Auto generated Serial by postgreSQL     |
| category    | string | Category which this item belongs to     |
| description | string | Details about the item                  |
| tag         | string | 'AVAILABLE', 'UNAVAILABLE', 'EXPIRED'   |
| timestamp   | bigint | Auto generated timestamp                |

### requests

| Name         | Type | Description                                         |
| ------------ | ---- | --------------------------------------------------- |
| id           | int4 | Auto generated Serial by postgreSQL                 |
| user_id      | int4 | Reference to users(id) whose get the request        |
| requester_id | int4 | Reference to users(id) whose request the item       |
| post_id      | int4 | Reference to posts(id) which item that is requested |

### users

| Name         | Type        | Description                                                                     |
| ------------ | ----------- | ------------------------------------------------------------------------------- |
| id           | number      | Auto generated Serial by postgreSQL                                             |
| email        | string      | For future purpose verification, forgot password, anti-spam                     | -> can change |
| username     | string      | Username of account which has passed frontend verification                      |
| full_name    | string      | Name for Account identifier                                                     |
| password     | string      | password of account which has passed frontend verification, Hash(password+salt) |
| phone_number | string      | Number of phone that can be called                                              |
| location     | string      | Places the user live in                                                         |
| avatar       | string      | Cloudinary URL                                                                  |
| gender       | string      | 'Male', 'Female', 'Other'                                                       |
| following    | Array[{id}] | List of userId whoever this user follow                                         |
| follower     | Array[{id}] | List of userId whoever follows this user                                        |

## Authentication

### Sign Up (SIGNUP SCENE)

- [x] Finished (Fetchable)

| A           | B                                 |
| ----------- | --------------------------------- |
| FETCH       | /api/auth/sign-up                 |
| METHOD      | POST                              |
| Description | Endpoint used for adding new user |

> Request Header

```bash
Content-Type: multipart/form-data
```

> Request Body Multipart

```bash
{
  email: string,
  username: string,
  password: string, *checked before go to server min. 6 char, etc.
  full_name: string,
  phone_number: string,
  location: string,
  image: file | string, *optional
}
```

> Response Value

```bash
{
  success: boolean,
  data: [
    {
      id: number,
      email: string,
      username: string,
      full_name: string,
      phone_number: string,
      location: string,
      avatar: string | null,
      gender: string \* 'Male', 'Female', 'Other',
      following: [{id}],
      follower: [{id}],
    }
  ],
  message: "full_name has been added.",
  token: generated with JWT middleware, use this for session and authenticate each time fetching,
}
```

### Sign In (LOGIN SCENE)

- [x] Finished (Fetchable)

| A           | B                                          |
| ----------- | ------------------------------------------ |
| FETCH       | /api/auth/sign-in                          |
| METHOD      | POST                                       |
| Description | Endpoint used for login from user or admin |

> Request Header

```bash
Content-Type: application/json
```

> Request Body JSON

```bash
{
  credential: string, \*can login with email or username
  password: string,
}
```

> Response Value

```bash
{
  success: boolean,
  data: [
    {
      id: number,
      email: string,
      username: string,
      full_name: string,
      phone_numbe: string,
      location: string,
      avatar: string | null,
      gender: string \* 'Male', 'Female', 'Other',
      following: [{id}],
      follower: [{id}],
    }
  ],
  message: "full_name has been added.",
  token: generated with JWT middleware, use this for session and authenticate each time fetching,
}
```

---

## Pages

### Home

- [x] Finished (Fetchable)

| A           | B                                                |
| ----------- | ------------------------------------------------ |
| FETCH       | /api/page/home                                   |
| METHOD      | GET                                              |
| Description | Page's Endpoint used to get data from home scene |

> Request Header

```bash
Content-Type: application/json
Authorization: <token app get when login>
```

> Response Value

```bash
{
  success: boolean,
  data: [
    {
      id: number,
      user_id: number,
      item_name: string,
      image: string,
      buy_date: string,
      exp_date: string,
      category: string,
      description: string,
      tag: string, \*'AVAILABLE', 'UNAVAILABLE', 'EXPIRED',
      timestamp: string,
      username: string,
      full_name: string,
      location: string,
      avatar: string | null,
    }
  ],
  message : "Successfully get home data",
}
```

### My Profile (MY PROFILE SCENE)

- [x] Finished (Fetchable)

| A           | B                                      |
| ----------- | -------------------------------------- |
| FETCH       | /api/page/profile                      |
| METHOD      | GET                                    |
| Description | Page's Endpoint to get my profile data |

> Request Header

```bash
Content-Type: application/json
Authorization: <token app get when login>
```

> Response Value

```bash
{
  success: boolean,
  data: [
   {
     user : [
      {
        id: number,
        email: string,
        username: string,
        full_name: string,
        phone_number: string,
        location: string,
        avatar: string | null,
        gender: string \* 'Male', 'Female', 'Other',
        following: Array[{id}],
        follower: Array[{id}]
        is_followed_by_you: boolean
      }
     ],
     post : [
      {
        id: number,
        user_id: number,
        item_name: string,
        image: string,
        buy_date: string, \*YYYY-MM-DD
        exp_date: string, \*YYYY-MM-DD
        category: string,
        description: string,
        tag: string, \*'AVAILABLE' OR 'EXPIRED',
        timestamp: string
      }
     ]
   }
  ],
  message: "Successfully retrieve my profile",
}
```

### User Profile (USER PROFILE SCENE)

- [x] Finished (Fetchable)

| A           | B                                        |
| ----------- | ---------------------------------------- |
| FETCH       | /api/page/profile/:id                    |
| METHOD      | GET                                      |
| Description | Page's Endpoint to get user profile data |

> Request Header

```bash
Content-Type: application/json
Authorization: <token app get when login>
```

> Response Value

```bash
{
  success: boolean,
  data: [
   {
     user : [
      {
        id: number,
        email: string,
        username: string,
        full_name: string,
        phone_number: string,
        location: string,
        avatar: string | null,
        gender: string \* 'Male', 'Female', 'Other',
        following: Array[{id}],
        follower: Array[{id}]
      }
     ],
     post : [
      {
        id: number,
        user_id: number,
        item_name: string,
        image: string,
        buy_date: string, \*YYYY-MM-DD
        exp_date: string, \*YYYY-MM-DD
        category: string,
        description: string,
        tag: string, \*'AVAILABLE', 'UNAVAILABLE', 'EXPIRED',
        timestamp: string
      }
     ]
   }
  ],
  message: "Successfully retrieve user profile",
}
```

---

## Features

### Add Post (ADD POST SCENE)

- [x] Finished (Fetchable)

| A           | B                                     |
| ----------- | ------------------------------------- |
| FETCH       | /api/feature/add-post                 |
| METHOD      | POST                                  |
| Description | Feature's Endpoint used to add a post |

> Request Header

```bash
Content-Type: multipart/form-data
Authorization: <token app get when login>
```

> Request Body JSON

```bash
{
  image: file | string,
  item_name: string,
  buy_date: string, \*YYYY-MM-DD
  exp_date: string, \*YYYY-MM-DD
  category: string,
  description: string,
  tag: string, \*'AVAILABLE', 'EXPIRED',
}
```

> Response Value

```bash
{
  success: boolean,
  data: [
    {
      id: number,
      user_id: number,
      item_name: string,
      image: string,
      buy_date: string, \*YYYY-MM-DD
      exp_date: string, \*YYYY-MM-DD
      category: string,
      description: string,
      tag: string, \*'AVAILABLE', 'UNAVAILABLE', 'EXPIRED',
      timestamp: string,
    }
  ],
  message: "Successfully insert a Post!"
}
```

### Edit Post (EDIT POST SCENE)

- [x] Finished (Fetchable)

| A           | B                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| FETCH       | /api/feature/edit-post/:post_id                                                                             |
| METHOD      | POST                                                                                                        |
| Description | Feature's Endpoint used to edit a post that user has, handled so another user can't edit other people posts |

> Request Header

```bash
Content-Type: multipart/form-data
authorization: <token app get when login>
```

> Request Body Multipart

```bash
{
  image: file | string, *optional, don't send same image if user doesn't change the post image
  item_name: string,
  buy_date: string, \*YYYY-MM-DD
  exp_date: string, \*YYYY-MM-DD
  category: string,
  description: string,
  tag: string, \*'AVAILABLE', 'EXPIRED',
}
```

> Response Value

```bash
{
  success: boolean,
  data: [
    {
      id: number,
      user_id: number,
      item_name: string,
      image: string,
      buy_date: string, \*YYYY-MM-DD
      exp_date: string, \*YYYY-MM-DD
      category: string,
      description: string,
      tag: string, \*'AVAILABLE', 'UNAVAILABLE', 'EXPIRED',
      timestamp: string,
    }
  ],
  message: "Successfully insert a Post!"
}
```

### Delete Post (DELETE POST SCENE)

- [x] Finished (Fetchable)

| A           | B                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| FETCH       | /api/feature/delete-post/:post_id                                                                           |
| METHOD      | GET                                                                                                         |
| Description | Feature's Endpoint used to edit a post that user has, handled so another user can't edit other people posts |

> Request Header

```bash
Content-Type: application/json
Authorization : <token app get when login>
```

> Response Value

```bash
{
  success : boolean,
  data : [],
  message : "Successfully Getting Rid A Post!"
}
```

### Edit Profile (EDIT PROFILE SCENE)

- [x] Finished (Fetchable)

| A           | B                                       |
| ----------- | --------------------------------------- |
| FETCH       | /api/feature/edit-profile               |
| METHOD      | POST                                    |
| Description | Feature's Endpoint used to edit profile |

> Request Header

```bash
Content-Type: multipart/form-data
Authorization : <token app get when login>
```

> Request Body JSON

```bash
{
  image: string,
  full_name: string,
  phone_number: string,
  location: string,
  gender: string \* 'Male', 'Female', 'Other',
}
```

> Response Value

```bash
{
  success : boolean,
  data : [
    {
      id: number,
      email: string,
      username: string,
      full_name: string,
      phone_number: string,
      location: string,
      avatar: string | null,
      gender: string \* 'Male', 'Female', 'Other',
      following: Array[id],
      follower: Array[id],
    }
  ],
  message : "User profile has been changed"
}
```

### Follow (TOGGLE FOLLOW & UNFOLLOW)

- [x] Finished (Fetchable)

| A           | B                                          |
| ----------- | ------------------------------------------ |
| FETCH       | /api/feature/follow/:user_id               |
| METHOD      | GET                                        |
| Description | Feature's Endpoint used to follow/unfollow |

> Request Header

```bash
Content-Type: application/json
Authorization: <token app get when login>
```

> Response Value

```bash
{
  success : boolean,
  data : [],
  message : "User has been followed" / "User has been unfollowed",
}
```
