
var fill = d3.scale.category20b();

var w = 960,
    h = 600;

var words = [],
    max,
    scale = 1,
    complete = 0,
    keyword = "",
    tags,
    fontSize,
    maxLength = 30,
    fetcher,
    statusText = d3.select("#status");

var layout = d3.layout.cloud()
    .timeInterval(10)
    .size([w, h])
    .fontSize(function(d) { return fontSize(+d.value); })
    .text(function(d) { return d.key; })
    .on("word", progress)
    .on("end", draw);

var unicodePunctuationRe = "!#%\\*,\\/:\\;?@_{}՚";

var stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
    punctuation = new RegExp("[" + unicodePunctuationRe + "]", "g"),
    wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
    discard = /^(@|https?:|\/\/)/,
    htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g,
    matchTwitter = /^https?:\/\/([^\.]*\.)?twitter\.com/;


var svg = d3.select("#footer").append("svg")
    .attr("width", w)
    .attr("height", h);

var background = svg.append("g"),
    vis = svg.append("g")
    .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");


var textdata = "The sun did not shine. It was too wet to play. So we sat in the house All that cold, cold, wet day.I sat there with Sally, we sat there we two. And I said, â€œHow I wish we had something to do!â€ Too wet to go out and too cold to play ball. So we sat in the house. We did nothing at all. So all we could do was to Sit! Sit! Sit! Sit! And we did not like it. Not one little bit. And then something went BUMP! How that bump made us jump! We looked! Then we saw him step in on the mat! We looked! And we saw him! The Cat in the Hat! And he said to us, â€œWhy do you sit there like that?â€ â€œI know it is wet And the sun is not sunny. But we can have lots of good fun that is funny!â€ â€œI know some good games we could play,â€ Said the cat. â€œI know some new tricks,â€ Said the Cat in the Hat. â€œA lot of good tricks. I will show them to you. Your mother Will not mind at all if I do.â€ Then Sally and I Did not know what to say. Our mother was out of the house For the day. But the fish said, â€œNo! No! Make that cat go away! Tell that Cat in the Hat you do NOT want to play. He should not be here. He should not be about. He should not be here When your mother is out!â€ â€œNow! Now! Have no fear. Have no fear!â€ said the cat. â€œMy tricks are not bad,â€ Said the Cat in the Hat. â€œWhy, we can have lots of good fun, if you wish, With a game that I call UP UP UP with a fish!â€ â€œPut me down!â€ said the fish. â€œThis is no fun at all! Put me down!â€ said the fish. â€œI do NOT wish to fall!â€ â€œHave no fear!â€ said the cat. â€œI will not let you fall. I will hold you up high as I stand on a ball. With a book on one hand! And a cup on my hat! But that is not ALL I can do!â€ said the cat... â€œLook at me! Look at me now!â€ said the cat. â€œWith a cup and a cake on the top of my hat! I can hold up TWO books! I can hold up the fish! And a little toy ship! And some milk on a dish! And look! I can hop up and down on the ball! But that is not all! Oh, no. That is not all... â€œLook at me! Look at me! Look at me NOW! It is fun to have fun But you have to know how. I can hold up the cup And the milk and the cake! I can hold up these books! And the fish on a rake! I can hold the toy ship And a little toy man! And look! With my tail I can hold a red fan! I can fan with the fan As I hop on the ball! But that is not all. Oh, no. That is not all...â€ That is what the cat said... Then he fell on his head! He came down with a bump from up there on the ball. And Sally and I, We saw ALL the things fall! And our fish came down, too. He fell into a pot! He said, â€œDo I like this? Oh, no! I do not. This is not a good game,â€ Said our fish as he lit. â€œNo, I do not like it, Not one little bit!â€ â€œNow look what you did!â€ Said the fish to the cat. â€œNow look at this house! Look at this! Look at that! You sank our toy ship, Sank it deep in the cake. You shook up our house And you bent our new rake. You SHOULD NOT be here when our mother is not. You get out of this house!â€ Said the fish in the pot. â€œBut I like it here. Oh, I like it a lot!â€ Said the Cat in the Hat To the fish in the pot. â€œI will NOT go away. I do NOT wish to go! And so,â€ said the Cat in the Hat, â€œSo so so... I will show you Another good game that I know!â€ And then he ran out. And then, fast as a fox, The Cat in the Hat Came back in with a box. A big red wood box. It was shut with a hook. â€œNow look at this trick,â€ Said the cat. â€œTake a look!â€ Then he got up on top With a tip of his hat. â€œI call this game FUN IN A BOX,â€ Said the cat. â€œIn this box are two things I will show to you now. You will like these two things,â€ Said the cat with a bow. â€œI will pick up the hook. You will see something new. Two things. And I call them Thing One and Thing Two. These things will not bite you. They want to have fun.â€ Then, out of the box Came Thing Two and Thing One! And they ran to us fast. They said, â€œHow do you do? Would you like to shake hands With Thing One and Thing Two?â€ And Sally and I Did now know what to do. So we had to shake hands With Thing One and Thing Two. We shook their two hands. But our fish said, â€œNo! No! Those Things should not be In this house! Make them go! â€œThey should not be here When your mother is not! Put them out! Put them out!â€ Said the fish in the pot. â€œHave no fear, little fish,â€ Said the Cat in the Hat. â€œThese things are good Things.â€ And he gave them a pat. â€œThey are tame. Oh, so tame! They have come here to play. They will give you some fun On this wet, wet day.â€ â€œNow, here is a game that they like,â€ Said the cat. â€œThey like to fly kites,â€ Said the Cat in the Hat. â€œNo! Not in the house!â€ Said the fish in the pot. â€œThey should not fly kites In a house! They should not. Oh, the things they will bump! Oh, the things they will hit! Oh, I do not like it! Not one little bit!â€ Then Sally and I Saw them run down the hall. We saw those two Things Bump their kites on the wall! Bump! Thump! Thump! Bump! Down the wall in the hall. Thing Two and Thing One! They ran up! They ran down! On the string of one kit We saw Motherâ€™s new gown! Her gown with the dots That are pink, white and red. Then we saw one kite bump On the head of her bed! Then those Things ran about With big bumps, jumps and kicks And with hops and big thumps And all kinds of bad tricks. And I said, â€œI do NOT like the way that they play! If Mother could see this, Oh, what would she say!â€ Then our fish said, â€œLook! Look!â€ And our fish shook with fear. â€œYour mother is on her way home! Do you hear? Oh, what will she do to us? What will she say? Oh, she will not like it To find us this way!â€ â€œSo, DO something! Fast!â€ said the fish. â€œDo you hear! I saw her. Your mother! Your mother is near! So, as fast as you can, Think of something to do! You will have to get rid of Thing One and Thing Two!â€ So, as fast as I could, I went after my net. And I said, â€œWith my net I can get them I bet. I bet, with my net, I can get those Things yet!â€ Then I let down my net. It came down the a PLOP! And I had them! At last! Those two Things had to stop. Then I said to the cat, â€œNow, you do as I say. You pack up those Things And you take them away!â€ â€œOh dear!â€ said the cat. â€œYou did not like our game... Oh dear. What shame! What a shame! What a shame!â€ Then he shut up the Things In the box with the hook. And the cat went away With a sad kind of look. â€œThat is good said the fish.â€He has gone away. Yes. But your mother will come. She will find this big mess! And this mess is so big And so deep and so tall, we can not pick it up. There is no way at all!â€ And THEN! Who was back in the house? Why, the cat! â€œHave no fear of this mess,â€ Said the Cat in the Hat. â€œI always pick up all my playthings And so... I will show you another good trick that I know!â€ Then we saw him pick up all the things that were down. He picked up the cake, And the rake, And the gown, And the milk, and the strings, And the books, and the dish, And the fan, and the cup, And the ship, and the fish. And he put them away. Then he said, â€œThat is that.â€ And then he was gone, with the tip of his hat. Then our mother came in And said said to us two, â€œDid you have any fun? Tell me. What did you do?â€ And Sally and I did not know What to say. Should we tell her The things that went on there that day? She we tell her about it? Now, what SHOULD we do? Well... what would YOU do If you mother asked YOU?"; 
console.log("this is a test again");

load(textdata);
