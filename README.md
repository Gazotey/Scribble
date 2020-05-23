# Scribble
##### A visual tool for developing Create Your Own Adventure Games (CYOAG)
This tool can be used to write text-based games where the choices of the players affect the flow of the story. It's useful for visualizing the flow of your story.  
There currently is no export or build functionality of any kind. I do plan to implement an export to JSON feature in the future.  

For every prompt of text, it shows a card. Cards have connections with other cards, which represent the choices the user can choose from.  

Development on Scribble has slowed down due to a lack of time, so I'm making it available for general use.  

<img src="img/screenshot.jpg" style="border:1px solid black">

### Features available
##### Editing text
<img src="img/editing_cards.gif" style="border:1px solid black">

##### Adding choices for the user
<img src="img/add_user_choice.gif" style="border:2px solid black">

<img src="img/add_user_choice_2.gif" style="border:2px solid black">

##### Setting card types
<img src="img/card_types.gif" style="border:2px solid black">

##### Connecting cards
<img src="img/connecting_cards.gif" style="border:2px solid black">

##### Previewing the game
<img src="img/preview_mode.gif" style="border:2px solid black">

### Missing essential features
I plan to implement at least these features at some point.
- Export game to JSON
- Load game to JSON

### Technical details
This tool has been written in plain Javascript, using JQuery for some events and for getting values from text fields.  
It uses the HTML5 Canvas API for drawing the cards, lines, and text without the use of any additional libraries.

### Dependencies
- JQuery (could be replaced with vanilla Javascript relatively easy)
- [Featherlight](https://github.com/noelboss/featherlight "Featherlight on Github") (for the Game Preview)


### Meta
Original version developed by Vincent van Hoven.  
Distributed under the GNU GPLv3 license.  
See `LICENSE` for more information or [choosealicense.com](https://choosealicense.com/licenses/gpl-3.0) for a quick overview of what this means.