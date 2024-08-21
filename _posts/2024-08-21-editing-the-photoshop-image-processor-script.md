---
---

I've always wanted to change the way the image processor works in Photoshop by having it move the original files to their own folder and then have the saved images be back in the parent folder. After a lot of trial and error I finally got it working.

The reason we want to do this is the online ordering system our [photo lab](https://prolabprints.com) uses gives us a customers originals files and then the rendered files with cropping for whatever they ordered. If we need to color correct the images we like to correct the original files and then re-render the order. We color correct using Adobe Camera Raw (ACR) and when done we run the images thru the image processor. But that outputs them to a JPEG sub folder and we would then have to drag them back up and overwrite the originals.

You can find what I did on [bitbucket](https://bitbucket.org/fpl619/rons-image-processor/src/master/).

Things I learned:

- Photoshop keeps all the scripts in the same global scope - so if you have the same variable names or function names in 2 different scripts they may clash. Since I duplicated the original image processor I had some issues with this. I add a prefix to a handful of variables and functions and it seems ok. One way around the scope issue is to wrap your code in an anonymous function, but I wasn't sure what to wrap so I didn't try this. I think prefixing your variables with something really unique is a good fix.
- AI is your friend, GH copilot understood what I wanted to do and helped in a couple places where I was lost.
- Photoshop seems to have a limit on how much code can be in one script file? when I had all the code in one file (even using the same exact original image processor script) nothing would happen when I launched the script from Bridge. Once I broke it up into multiple files it worked. I read somewhere that one way around this is to set a delay/timeout but I didn't try that.
- Importing other scripts into a main photoshop script file is not as easy as it seems - I saw in places to use `#include myfile.jsx` but that didn't work. What did work was `$.evalFile("C:/rons-image-processor/utils-main.jsx");`. This was something copilot said to try, I didn't see it when googling.
- I wasn't comfortable using the default scripts locations as the code to do the path included the year of the version which means it would break on each upgrade unless you updated the paths? seems easier to have all the files in a folder on the C drive and then you just drop in the startup script for Bridge.
