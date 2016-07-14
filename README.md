# getstagram
public api for instagram

## Endpoints
**Get**  
Request  

    http://getstagram.herokuapp.com/tag/:tag
    
*example*
    http://getstagram.heroku.com/tag/instadaily
    
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
