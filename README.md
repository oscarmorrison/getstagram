# getstagram
public api for instagram

## Endpoints
**Get**  
Request  

    https://getstagram.herokuapp.com/tag/:tag
    
*example*
    https://getstagram.heroku.com/tag/instadaily
    
Response
```
 {
    posts: [
        {
            date: date,
            caption: string,
            dimensions: {
                width: number,
                height: number
            },
            likes: {
                count: number
            },
            thumbnail_src: string,
            is_video: bool,
            display_src: string
        }
    ]
}
```
