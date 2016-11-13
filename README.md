# VandyHacks
Can machines learn to compose? (maybe)

INSPIRATION:
We're all music lovers in this team, and also have a passion for artificial intelligence and machine learning.  We wanted to build a web interface that allows users to
listen to, learn, and play songs, while at the same time exploring genetic algorithms for music generation.

WHAT IT DOES:
Users can watch their favorite songs be visualized in midi form, and even play along to learn that song. NoteLab is intended to be a better alternative to sheet music, and therefore
a way to motivate future musicians to learn music.  The end goal is to allow users to record and upload the songs
they themselves play, and then the machine learning algorithm will write music in the same style as what the user played. To facilitate the learning process, we use
parallel processing to distribute the job amongst 20 Odroids.

HOW WE BUILT IT:
Each of our four members was assigned a different job to get to our end goal.  The front end was built in Javascript, PHP, HTML, and CSS and designed to run entirely
in the browser with a single midi device connected via USB.  The genetic algorithm was written in Python and had two parts: the test of fitness and the breeding/mutation technique.  The test of fitness
uses a modified K-means with standard deviation to plot a 'location' of the average center of the training song.  The breeding technique merges measures and notes of well-fit
songs together and random mutations allow variety in the population.  And finally, a method was devised to distribute processes amongst 20 Odroids to lighten the learning load.

CHALLENGES WE RAN INTO:
The entire project was possibly too ambitious for a single weekend, and with only one man per job, it was tough to get everything to come together.

Once the genetic algorithm was generating music, we realized we needed smoothing algorithms to help the newly-generated song to converge, and this took some time to both design conceptually
as well as implement.

WHAT WE LEARNED:
We learned how to better work as a team under pressure and with very little sleep.  We also learned how to coordinate source control to ensure we didn't step on each other's toes.

WHAT'S NEXT FOR NOTELAB:
We have many features we'd like to implement, such as an entire social network for users to create profiles and interact with each other, a way to upload songs and save them to play later (or 
share with friends), a way to generate new music based on what users have played or even have in their 'favorites' library.  There are a lot of different avenues to go with this central platform,
and we can't wait to work on them more after the hackathon. 
