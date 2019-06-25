# getstagram
public api for instagram

**_Disclaimer_**  
_getstagram is an expirimental API, and is not to be consumed for public or commercial use. getstagram is in no way affiliated with instagram, facebook or any other related entities._

## Endpoints
**Get**  
Request  

    http://getstagram.herokuapp.com/tag/:tag

**Get**  
Request  

    http://getstagram.herokuapp.com/user/:username
    
    
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
            display_src: string,
            link: string
        }
    ]
}
```
