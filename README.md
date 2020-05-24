# Scribble
##### A visual tool for developing Create Your Own Adventure Games (CYOAG)
This tool can be used to write text-based games where the choices of the players affect the flow of the story. It's useful for visualizing the flow of your story.  
There currently is no build functionality of any kind, but games can be exported to JSON (and imported) to use in your application.  

For every prompt of text, it shows a card. Cards have connections with other cards, which represent the choices the user can choose from.  

Development on Scribble has slowed down due to a lack of time, so I'm making it available for general use.  
All contributions are welcome!

[Demo](https://gazotey.github.io/Scribble/) (master branch)

<table><tr><td>
<img src="img/screenshot.jpg">
</td></tr></table>

### Features available
##### Editing text

<details>
<summary>Gif</summary>

![](img/editing_cards.gif)

</details>


##### Adding choices for the player
These choices make the flow of the story.

<details>
<summary>Gif</summary>

![](img/add_user_choice.gif)

</details>


<details>
<summary>Gif</summary>

![](img/add_user_choice_2.gif)

</details>


##### Setting card types
Make a card a `Win` card, `Game Over` card, or a `Normal` card.

<details>
<summary>Gif</summary>

![](img/card_types.gif)

</details>


##### Connecting cards
Connecting two card creates a choice for the player on the parent card.

<details>
<summary>Gif</summary>

![](img/connecting_cards.gif)

</details>


#### Selecting multiple cards
Multiple cards can be selected by dragging a selection or by using the shortcut (`CRTL` + `click` cards)  

<details>
<summary>Gif</summary>

![](img/multi-selection.gif)

</details>


#### Deleting cards
Pressing `delete` deletes all currently selected cards.

<details>
<summary>Gif</summary>

![](img/shortcut_delete.gif)

</details>


##### Previewing the game
Using this basic preview, the flow of the game can be tested.

<details>
<summary>Gif</summary>

![](img/preview_mode.gif)

</details>

### Missing nice-to-have features
I _may_ implement some of these at some point.
- Undo/redo in editor
- Build JSON export as android game
- Saving/loading projects using IndexedDB

### Technical details
This tool has been written in plain Javascript, using JQuery for some events and for getting values from text fields.  
It uses the HTML5 Canvas API for drawing the cards, lines, and text without the use of any additional libraries.

### Dependencies
- Bootstrap
- [Featherlight](https://github.com/noelboss/featherlight "Featherlight on Github") (for the Game Preview)
- JQuery as Bootstrap and Featherlight dependency. Also used lightly for events and DOM manipulation.


### Meta
Original version developed by Vincent van Hoven.  
Distributed under the GNU GPLv3 license.  
See `LICENSE` for more information or [choosealicense.com](https://choosealicense.com/licenses/gpl-3.0) for a quick overview of what this means.
