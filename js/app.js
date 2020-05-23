var UserChoice = function(a_ChoiceText, a_CardIDToGoTo) {
    this.m_ChoiceText       = a_ChoiceText;
    this.m_CardIDToGoTo     = a_CardIDToGoTo;
}

var StoryCard = function() {
    App.m_CardIDCounter     += 1;

    // Member variables
    this.m_Position                     = { x: 0, y: 0 };
    this.m_Size                         = { x: 300, y: 450 };
    this.m_BorderSize                   = { x: 5, y: 5 };
    this.m_StoryTextArray               = [];
    this.m_UserChoices                  = [];
    this.m_ID                           = App.m_CardIDCounter;
    this.m_CardType                     = App.m_CardTypes.normal;
    this.m_AmountOfMasters              = 0;

    this.MoveByOffset = function(diffX, diffY) {
        if(this.m_AmountOfMasters == 0) {
            // Special case for the origin card
            this.m_Position.x += diffX;
            this.m_Position.y += diffY;
        } else {
            // For all other cards
            this.m_Position.x += diffX;
            this.m_Position.y += diffY;
        }
    }

    // Add slave card
    this.AddUserChoice = function(a_IDOfExistingCard) {
        var IDOfStoryCard;
        
        if(a_IDOfExistingCard == undefined) {
            IDOfStoryCard       = App.AddStoryCard();

            var masterPosX      = this.m_Position.x;
            var masterPosY      = this.m_Position.y;
            var masterSizeY     = this.m_Size.y;

            App.m_StoryCardsArray[App.GetStoryCardIndexByID(IDOfStoryCard)].m_Position.x            = masterPosX + (10 * this.m_UserChoices.length);
            App.m_StoryCardsArray[App.GetStoryCardIndexByID(IDOfStoryCard)].m_Position.y            = masterPosY + masterSizeY + 100;
            App.m_StoryCardsArray[App.GetStoryCardIndexByID(IDOfStoryCard)].m_AmountOfMasters       += 1;
        } else {
            // If card with passed ID is already a slave of current card
            for(i = 0; i < this.m_UserChoices.length; i++) {
                if(this.m_UserChoices[i].m_CardIDToGoTo == a_IDOfExistingCard) {
                    return -1;
                }
            }

            IDOfStoryCard                                                                           = a_IDOfExistingCard;
            App.m_StoryCardsArray[App.GetStoryCardIndexByID(a_IDOfExistingCard)].m_AmountOfMasters  += 1;
        }

        var newUserChoice       = new UserChoice("Placeholder", IDOfStoryCard);
        this.m_UserChoices.push(newUserChoice);
    }

    this.RemoveUserChoice = function(a_IDOfExistingCard) {
        if(a_IDOfExistingCard == undefined) {
            return false;
        } else {
            for(UserChoiceRemovalCnt = 0; UserChoiceRemovalCnt < this.m_UserChoices.length; UserChoiceRemovalCnt++) {
                if(this.m_UserChoices[UserChoiceRemovalCnt].m_CardIDToGoTo == a_IDOfExistingCard) {
                    this.m_UserChoices.splice(UserChoiceRemovalCnt, 1);
                }
            }
        }
    }

    // Draw text
    this.DrawText = function() {
        App.m_Context.fillStyle = 'black';
        App.m_Context.font      = (18 * App.m_WorldZoom) + 'px serif';

        var lineCount       = 0;        // Amount of lines already drawn (note that it starts at 0)
        var currentLine     = "";       // Current line that'll be drawn
        var IsLastDrawLine  = false;    // This may not be the last line of the text, but it is the last one that'll fit in the preview

        for(s = 0; s < this.m_StoryTextArray.length; s++) {
            // If there's too many lines in the preview text
            if(lineCount + 1 >= App.m_MaxLinesOnStoryCardPreview) {
                IsLastDrawLine = true;
            }

            // If current part of StoryTextArray has a line break
            if(this.m_StoryTextArray[s].split("\n").length > 1) {
                var SplittedStoryPart = this.m_StoryTextArray[s].split("\n");

                for(splt = 0; splt < SplittedStoryPart.length; splt++) {
                    // "" is a newline at the start, newlines at the end are handled elsewhere
                    if(SplittedStoryPart[splt] == "" && splt != (SplittedStoryPart.length - 1)) {
                        // Draw the currentLine, creating a newline
                        if(currentLine != "") {
                            // If we're at the last line, break. Outside of the for-loop there's a last draw call
                            if(IsLastDrawLine) {
                                break;
                            }

                            App.m_Context.fillText(currentLine, (this.m_Position.x + App.m_WorldOffset.x + App.ec_PaddingAroundCardText.x) * App.m_WorldZoom, (this.m_Position.y + App.m_WorldOffset.y + App.ec_PaddingAroundCardText.y + 18 + (lineCount * 20)) * App.m_WorldZoom)
                        }
                        
                        lineCount++;
                        currentLine = "";
                    } else {
                        // Add current word to currentLine
                        currentLine += SplittedStoryPart[splt] + " ";

                        // If current word is not the last index of SplittedStoryPart
                        // The last index should only trigger a breakline if it's value is "",
                        //   which is taken care of above
                        if(splt != (SplittedStoryPart.length - 1)) {
                            // If the width of currentLine has exceded the max
                            if(App.m_Context.measureText(currentLine).width > (this.m_Size.x - (App.ec_PaddingAroundCardText.x * 2))) {
                                // If we're at the last line, break. Outside of the for-loop there's a last draw call
                                if(IsLastDrawLine) {
                                    break;
                                }

                                // Remove the last word of the string (it's too long, after all)
                                // The first run is to remove the space added at the end of the currentLine and
                                //   the second run is to remove the last word of the string
                                currentLine = currentLine.substring(0, currentLine.lastIndexOf(" "));
                                currentLine = currentLine.substring(0, currentLine.lastIndexOf(" "));

                                // Draw the currentLine, creating a newline
                                App.m_Context.fillText(currentLine, (this.m_Position.x + App.m_WorldOffset.x + App.ec_PaddingAroundCardText.x) * App.m_WorldZoom, (this.m_Position.y + App.m_WorldOffset.y + App.ec_PaddingAroundCardText.y + 18 + (lineCount * 20)) * App.m_WorldZoom)
                                lineCount++;

                                // Re-add the removed last word of the string
                                currentLine = SplittedStoryPart[splt] + " ";
                            } else {
                                // If we're at the last line, break. Outside of the for-loop there's a last draw call
                                if(IsLastDrawLine) {
                                    break;
                                }

                                // Draw the currentLine, creating a newline
                                App.m_Context.fillText(currentLine, (this.m_Position.x + App.m_WorldOffset.x + App.ec_PaddingAroundCardText.x) * App.m_WorldZoom, (this.m_Position.y + App.m_WorldOffset.y + App.ec_PaddingAroundCardText.y + 18 + (lineCount * 20)) * App.m_WorldZoom)
                                lineCount++;
                                currentLine = "";
                            }
                        }
                    }
                }
            } else {
                currentLine += this.m_StoryTextArray[s] + " ";

                // If the width of currentLine has exceded the max
                if(App.m_Context.measureText(currentLine).width > ((this.m_Size.x - (App.ec_PaddingAroundCardText.x * 2)) * App.m_WorldZoom)) {
                    // If we're at the last line, break. Outside of the for-loop there's a last draw call
                    if(IsLastDrawLine) {
                        break;
                    }

                    // Remove the last word of the string (it's too long, after all)
                    // The first run is to remove the space added at the end of the currentLine and
                    //   the second run is to remove the last word of the string
                    currentLine = currentLine.substring(0, currentLine.lastIndexOf(" "));
                    currentLine = currentLine.substring(0, currentLine.lastIndexOf(" "));
                    
                    // Draw the currentLine
                    App.m_Context.fillText(currentLine, (this.m_Position.x + App.m_WorldOffset.x + App.ec_PaddingAroundCardText.x) * App.m_WorldZoom, (this.m_Position.y + App.m_WorldOffset.y + App.ec_PaddingAroundCardText.y + 18 + (lineCount * 20)) * App.m_WorldZoom)
                    lineCount++;

                    // Re-add the removed last word of the string
                    currentLine = this.m_StoryTextArray[s] + " ";
                }
            }
        }

        // If the text didn't fit in the preview box
        if(IsLastDrawLine) {
            // Remove the space at the end of the currentLine
            currentLine = currentLine.substring(0, currentLine.lastIndexOf(" "));

            // Variable for testing to see if the dots still fit on the line
            var TryOutText = currentLine + "...";

            // If they don't
            if(App.m_Context.measureText(TryOutText).width > (this.m_Size.x - (App.ec_PaddingAroundCardText.x * 2)) * App.m_WorldZoom) {
                // Remove the last word of the currentLine, so the dots can fit
                currentLine = currentLine.substring(0, currentLine.lastIndexOf(" "));
            }

            // Add the dots
            currentLine += "...";
        }

        // Draw the last line
        App.m_Context.fillText(currentLine, (this.m_Position.x + App.m_WorldOffset.x + App.ec_PaddingAroundCardText.x) * App.m_WorldZoom, (this.m_Position.y + App.m_WorldOffset.y + App.ec_PaddingAroundCardText.y + 18 + (lineCount * 20)) * App.m_WorldZoom)

        var TheChoiceNumberThatHasFocus = -1;
        for(sel_choice = 0; sel_choice < this.m_UserChoices.length; sel_choice++) {
            if($(".text-editor-option-user-choice-" + parseInt(sel_choice + 1)).is(":focus")) {
                TheChoiceNumberThatHasFocus = sel_choice;
            }
        }

        // Draw the UserChoice Text along the line connecting the master and slave
        for(usercho = 0; usercho < this.m_UserChoices.length; usercho++) {
            if(TheChoiceNumberThatHasFocus == usercho && App.m_CurrentlyEditingCardID == this.m_ID) {
                App.m_Context.fillStyle = 'green';
            } else if(TheChoiceNumberThatHasFocus != -1) {
                App.m_Context.fillStyle = 'black';
            }

            var GoToCardIndex       = App.GetStoryCardIndexByID(this.m_UserChoices[usercho].m_CardIDToGoTo);
            // Location of start of line (corrected for zoom and worldoffset)
            var FromCardPosX        = (this.m_Position.x + (this.m_Size.x / 2) + App.m_WorldOffset.x) * App.m_WorldZoom;
            var FromCardPosY        = (this.m_Position.y + this.m_Size.y + App.m_WorldOffset.y - 2) * App.m_WorldZoom;
            // Location of end of line (corrected for zoom and worldoffset)
            var GoToCardPosX        = (App.m_StoryCardsArray[GoToCardIndex].m_Position.x + (App.m_StoryCardsArray[GoToCardIndex].m_Size.x / 2) + App.m_WorldOffset.x) * App.m_WorldZoom;
            var GoToCardPosY        = (App.m_StoryCardsArray[GoToCardIndex].m_Position.y + App.m_WorldOffset.y + 2) * App.m_WorldZoom;
            // Vector with the direction and halve the length of the line
            var UserChoiceTextDiffX = (FromCardPosX - GoToCardPosX) / 2;
            var UserChoiceTextDiffY = (FromCardPosY - GoToCardPosY) / 2;
            // Location of start of line - vector
            var UserChoiceTextPosX  = FromCardPosX - UserChoiceTextDiffX;
            var UserChoiceTextPosY  = FromCardPosY - UserChoiceTextDiffY;
            
            // Draw the UserChoice text
            App.m_Context.fillText(this.m_UserChoices[usercho].m_ChoiceText, UserChoiceTextPosX, UserChoiceTextPosY)
        }
    }

    // Draw lines
    this.DrawLines = function() {
        if(App.m_FirstCardSelectedForConnectID == this.m_ID) {
            App.m_Context.strokeStyle   = 'green';
        } else if(App.GetIsCardWithIDCurrentlySelected(this.m_ID)) {
            App.m_Context.strokeStyle   = 'green';
        } else {
            App.m_Context.strokeStyle   = 'black';
        }

        var ChoiceNumberThatHasFocus = -1;
        for(choice = 0; choice < this.m_UserChoices.length; choice++) {
            if($(".text-editor-option-user-choice-" + parseInt(choice + 1)).is(":focus")) {
                ChoiceNumberThatHasFocus = choice;
            }
        }

        for(choice = 0; choice < this.m_UserChoices.length; choice++) {
            if(ChoiceNumberThatHasFocus == choice && App.m_CurrentlyEditingCardID == this.m_ID) {
                App.m_Context.strokeStyle = 'green';
            } else if(ChoiceNumberThatHasFocus != -1) {
                App.m_Context.strokeStyle = 'black';
            }

            var GoToCardIndex   = App.GetStoryCardIndexByID(this.m_UserChoices[choice].m_CardIDToGoTo);
            var FromCardPosX    = (this.m_Position.x + (this.m_Size.x / 2) + App.m_WorldOffset.x) * App.m_WorldZoom;
            var FromCardPosY    = (this.m_Position.y + this.m_Size.y + App.m_WorldOffset.y - 2) * App.m_WorldZoom;
            var GoToCardPosX    = (App.m_StoryCardsArray[GoToCardIndex].m_Position.x + (App.m_StoryCardsArray[GoToCardIndex].m_Size.x / 2) + App.m_WorldOffset.x) * App.m_WorldZoom;
            var GoToCardPosY    = (App.m_StoryCardsArray[GoToCardIndex].m_Position.y + App.m_WorldOffset.y + 2) * App.m_WorldZoom;

            App.m_Context.lineWidth = Math.ceil(3 * App.m_WorldZoom);
            App.m_Context.beginPath();
            App.m_Context.moveTo(FromCardPosX, FromCardPosY);
            App.m_Context.lineTo(GoToCardPosX, GoToCardPosY);
            App.m_Context.stroke();
        }
    }

    // Draw card
    this.Draw = function() {
        App.m_Context.fillStyle = 'black';
        App.m_Context.fillRect((this.m_Position.x + App.m_WorldOffset.x) * App.m_WorldZoom, (this.m_Position.y + App.m_WorldOffset.y) * App.m_WorldZoom, this.m_Size.x * App.m_WorldZoom, this.m_Size.y * App.m_WorldZoom);
        
        if(App.m_FirstCardSelectedForConnectID == this.m_ID) {
            // If the card is selected to be connected
            App.m_Context.fillStyle = 'green';
        } else if(App.m_FirstCardSelectedForDisconnectID == this.m_ID) {
            // If the card is selected to be disconnected
            App.m_Context.fillStyle = 'red';
        } else if(App.m_CurrentlyEditingCardID == this.m_ID) {
            // If the card is being edited
            App.m_Context.fillStyle = 'lightgreen';
        } else if(App.GetIsCardWithIDCurrentlySelected(this.m_ID)) {
            // If the card is selected
            App.m_Context.fillStyle = 'grey';
        } else if(App.GetStoryCardIndexByID(this.m_ID) == 0) {
            // Always draw the origin card (with index 0) lightgrey
            App.m_Context.fillStyle = 'lightgrey';
        } else if(this.m_CardType == App.m_CardTypes.gameover) {
            App.m_Context.fillStyle = 'rgb(255, 89, 89)';
        } else if(this.m_CardType == App.m_CardTypes.win) {
            App.m_Context.fillStyle = 'rgb(47, 255, 0)';
        } else {
            // Default
            App.m_Context.fillStyle = 'white';
        }

        App.m_Context.fillRect((this.m_Position.x + this.m_BorderSize.x + App.m_WorldOffset.x) * App.m_WorldZoom, (this.m_Position.y + this.m_BorderSize.y + App.m_WorldOffset.y) * App.m_WorldZoom, (this.m_Size.x - (this.m_BorderSize.x * 2)) * App.m_WorldZoom, (this.m_Size.y - (this.m_BorderSize.y * 2)) * App.m_WorldZoom);

        this.DrawText();
    }
}


var MakerApp = function() {
    // User variables
    this.MaxDelayForDoubleClick             = 500;                          // Max delay in microseconds between two clicks for them to count as a double-click

    // Member variables
    this.m_Canvas                           = document.getElementById('canvas-editor');     // Canvas element
    this.m_Context                          = this.m_Canvas.getContext('2d');                // 2d canvas context
    this.m_StoryCardsArray                  = [];                           // Array of all the story cards
    this.m_CurrentlySelectedCardsIDArray    = [];                           // Array with IDs of the currently selected cards
    this.m_CurrentlyEditingCardID           = -1;                           // ID of the card that's currently open in the editor
    this.m_RightMouseIsDragging             = false;                        // Is user right-click-dragging their mouse?
    this.m_LeftMouseIsDragging              = false;                        // Is user left-click-dragging their mouse?
    this.m_CurrentMouseWorldPosition        = { x: -1, y: -1 };
    this.m_MousePoseAtStartOfPotentialDrag  = { x: 0, y: 0 };               // Mouse position at the start of a potential drag
    this.m_MousePoseAtStartOfDragPersistant = { x: 0, y: 0 };               // Mouse position at the start of a left-click or right-click drag.
                                                                            //     This one is not updated every event tick, but persists until the MouseUp event triggers
    this.m_LastMouseLeftClick               = { x: 0, y: 0, time: null };   // Last mouse left-click position and time
    this.m_LeftMouseDownCardID              = -1;                           // The card ID the user left-clicked on. This is reset to -1 on MouseUp.
    this.m_TickRate                         = 60;                           // Amount of ticks per second
    this.m_WorldOffset                      = { x: 0, y: 0 };               // Offset of world due to "camera" moving
    this.m_WorldZoom                        = 1;                            // Current canvas zoom
    this.m_CardIDCounter                    = 5;                            // Start on five so I remember the ID's don't match the array indexes
    this.m_IsConnectModeActive              = false;                        // Has a card been chosen to be connected to another card by the user?
    this.m_IsDisconnectModeActive           = false;                        // Has a card been chosen to be disconnected from another card by the user?
    this.m_FirstCardSelectedForConnectID    = -1;                           // Card chosen by user (master) to be connected to another card (slave).
    this.m_FirstCardSelectedForDisconnectID = -1;                           // Card chosen by user (master) to be disconnected from another card (slave).
    this.m_TextEditorIsOpen                 = false;                        // Keeps track of the open / closed state of the text-editor (toggles whether 'delete' button removes selected card)
    this.m_MaxLinesOnStoryCardPreview       = 21;                           // The max amount of preview lines that the Story Cards can hold on-canvas
    this.m_CardTypes                        = {                             // All types of cards available
        start:          0,
        normal:         1,
        win:            2,
        gameover:       3
    };
    this.m_KeysCurrentlyPressedDown         = {                             // The application keys that are currently being pressed
        ctrl:           false,
        delete:         false
    };
    this.m_MouseButtonsCurrentlyPressed     = {                             // The mouse buttons that are currently being pressed
        left:           false,
        right:          false,
        middle:         false
    }

    // Editor config
    this.ec_PaddingAroundCardText           = { x: 10, y: 10 };
    
    // App config
    this.m_GameName                         = "Placeholder";                // Project name, adjustable by user
    this.ac_FontSize                        = 25;


    this.Init = function() {
        App.AddStoryCard();
        App.m_StoryCardsArray[0].MoveByOffset((App.m_Canvas.width / 2) - (App.m_StoryCardsArray[0].m_Size.x), (App.m_Canvas.height / 2) - (App.m_StoryCardsArray[0].m_Size.y / 2))
        App.m_StoryCardsArray[0].m_CardType = App.m_CardTypes.start;

        var GET_variables = location.search.replace('?', '').split('&').map(function(val){
            return val.split('=');
        });

        for(var GET_count = 0; GET_count < GET_variables.length; GET_count++) {
            if(GET_variables[GET_count][0] == "project") {
                App.Project_ID = GET_variables[GET_count][1];
            }
        }

        App.InitEventListeners();

        window.setInterval(function(){
            App.Update();
        }, (1 / App.m_TickRate));
    }

    this.DoLeftClickDown = function(posX, posY) {
        // Track that the left mouse button is pressed
        App.m_MouseButtonsCurrentlyPressed.left = true;

        // Set some variables to keep track of where potential drags started
        App.m_MousePoseAtStartOfClick           = { x: posX, y: posY };
        App.m_MousePoseAtStartOfPotentialDrag   = { x: posX, y: posY };
        App.m_MousePoseAtStartOfDragPersistant  = { x: posX, y: posY };

        // Save the click, and when it happened, for the detection of double-clicks
        var today       = new Date();

        // If the last click happened at the same position as the currently handling click
        if(App.m_LastMouseLeftClick.x == posX && App.m_LastMouseLeftClick.y == posY) {
            // Calculate the difference in time between the last click and the currently handling click
            var deltaTimeInMicroseconds = Math.abs(App.m_LastMouseLeftClick.time - today);

            // If the difference is lower than the threshold
            if(deltaTimeInMicroseconds <= App.MaxDelayForDoubleClick) {
                // Trigger double left click
                App.DoDoubleLeftClick(posX, posY);

                // Function will return after this, so set the App.m_LastMouseLeftClick values before that
                App.m_LastMouseLeftClick.time   = today;
                App.m_LastMouseLeftClick.x      = posX;
                App.m_LastMouseLeftClick.y      = posY;
                return;
            }
        }

        App.m_LastMouseLeftClick.time   = today;
        App.m_LastMouseLeftClick.x      = posX;
        App.m_LastMouseLeftClick.y      = posY;

        // Local vars
        var localClickPosX  = posX;
        var localClickPosY  = posY;
        var cardClicked     = false;

        // Hide context menu
        App.HideContextMenu();

        // Card clicked detection
        for(st = App.m_StoryCardsArray.length - 1; st >= 0; st--) {
            // Card locations are translated to the window coordinate system, offset by the header height
            // (the header-height-offset part was done before the start of this function)
            var localCardPosX   =  (App.m_StoryCardsArray[st].m_Position.x + App.m_WorldOffset.x) * App.m_WorldZoom;
            var localCardPosY   =  (App.m_StoryCardsArray[st].m_Position.y + App.m_WorldOffset.y) * App.m_WorldZoom;
            var localCardSizeX  =  (App.m_StoryCardsArray[st].m_Size.x) * App.m_WorldZoom;
            var localCardSizeY  =  (App.m_StoryCardsArray[st].m_Size.y) * App.m_WorldZoom;

            if(localClickPosX >= localCardPosX && localClickPosX <= localCardPosX + localCardSizeX &&
                localClickPosY >= localCardPosY && localClickPosY <= localCardPosY + localCardSizeY) {
                
                // If the text editor is open
                if(App.m_TextEditorIsOpen) {
                    // If the card clicked isn't the card that's being edited
                    if(App.m_StoryCardsArray[st].m_ID != App.m_CurrentlyEditingCardID) {
                        App.CloseTextEditor();
                    }
                }
                
                
                if(App.m_KeysCurrentlyPressedDown.ctrl) {
                    // If clicked card ID isn't in array of IDs of selected cards yet, add it
                    if(App.GetIsCardWithIDCurrentlySelected(App.m_StoryCardsArray[st].m_ID) == false) {
                        App.m_CurrentlySelectedCardsIDArray.push(App.m_StoryCardsArray[st].m_ID);
                    } else { // If it is, remove it from the array of IDs of selected cards
                        App.DeselectCard(App.m_StoryCardsArray[st].m_ID)
                    }
                } else {
                    if(App.m_CurrentlySelectedCardsIDArray.length < 2) {
                        // Clear array of IDs of selected cards
                        App.m_CurrentlySelectedCardsIDArray = [];
                        
                        // If clicked card ID isn't in array of IDs of selected cards yet, add it
                        if(App.GetIsCardWithIDCurrentlySelected(App.m_StoryCardsArray[st].m_ID) == false) {
                            App.m_CurrentlySelectedCardsIDArray.push(App.m_StoryCardsArray[st].m_ID);
                        }
                    }
                }
                
                App.m_LeftMouseDownCardID   = App.m_StoryCardsArray[st].m_ID;
                cardClicked                 = true;

                if(App.m_IsConnectModeActive) {
                    // Connect clicked card if connect mode active
                    App.m_StoryCardsArray[App.GetStoryCardIndexByID(App.m_FirstCardSelectedForConnectID)].AddUserChoice(App.m_CurrentlySelectedCardsIDArray[0]);

                    // Disable connect mode
                    App.m_FirstCardSelectedForConnectID = -1;
                    App.m_IsConnectModeActive           = false;
                }

                if(App.m_IsDisconnectModeActive) {
                    // Disconnect clicked card if disconnect mode active
                    App.m_StoryCardsArray[App.GetStoryCardIndexByID(App.m_FirstCardSelectedForDisconnectID)].RemoveUserChoice(App.m_CurrentlySelectedCardsIDArray[0]);

                    // Disable disconnect mode
                    App.m_FirstCardSelectedForDisconnectID  = -1;
                    App.m_IsDisconnectModeActive               = false;
                }

                break;
            }
        }

        if(!cardClicked) {
            // If the text editor is open
            if(App.m_TextEditorIsOpen) {
                App.CloseTextEditor();
            }

            // If any cards are currently selected
            if(App.m_CurrentlySelectedCardsIDArray.length != 0) {
                // for(A_ID = 0; A_ID < App.m_CurrentlySelectedCardsIDArray.length; A_ID++) {
                //     App.m_StoryCardsArray[App.GetStoryCardIndexByID(App.m_CurrentlySelectedCardsIDArray[A_ID])].m_IsSelected = false;
                // }

                App.m_CurrentlySelectedCardsIDArray = [];
                //App.UpdateTextEditorConfig();
            }

            // If connect mode is active and a first card has been selected
            if(App.m_IsConnectModeActive && App.m_FirstCardSelectedForConnectID != -1) {
                App.m_FirstCardSelectedForConnectID = -1;
                App.m_IsConnectModeActive           = false;
            }
        }
    }

    this.DoLeftClickUp = function(posX, posY) {
        App.m_MouseButtonsCurrentlyPressed.left = false;

        var localClickPosX  = posX;
        var localClickPosY  = posY;
        var cardClicked     = false;

        // Card clicked detection
        for(st = App.m_StoryCardsArray.length - 1; st >= 0; st--) {
            // Card locations are translated to the window coordinate system, offset by the header height
            // (the header-height-offset part was done before the start of this function)
            var localCardPosX   =  (App.m_StoryCardsArray[st].m_Position.x + App.m_WorldOffset.x) * App.m_WorldZoom;
            var localCardPosY   =  (App.m_StoryCardsArray[st].m_Position.y + App.m_WorldOffset.y) * App.m_WorldZoom;
            var localCardSizeX  =  (App.m_StoryCardsArray[st].m_Size.x) * App.m_WorldZoom;
            var localCardSizeY  =  (App.m_StoryCardsArray[st].m_Size.y) * App.m_WorldZoom;

            if(localClickPosX >= localCardPosX && localClickPosX <= localCardPosX + localCardSizeX &&
                localClickPosY >= localCardPosY && localClickPosY <= localCardPosY + localCardSizeY) {
                
                if(App.m_KeysCurrentlyPressedDown.ctrl) {
                    
                } else {
                    // Clear array of IDs of selected cards
                    App.m_CurrentlySelectedCardsIDArray = [];
                    
                    // If clicked card ID isn't in array of IDs of selected cards yet, add it
                    if(App.GetIsCardWithIDCurrentlySelected(App.m_StoryCardsArray[st].m_ID) == false) {
                        App.m_CurrentlySelectedCardsIDArray.push(App.m_StoryCardsArray[st].m_ID);
                    }
                }
                
                cardClicked = true;
                //App.UpdateTextEditorConfig();

                if(App.m_IsConnectModeActive) {
                    // Mark clicked card for connecting if connect mode active
                    App.m_StoryCardsArray[App.GetStoryCardIndexByID(App.m_FirstCardSelectedForConnectID)].AddUserChoice(App.m_StoryCardsArray[App.m_CurrentlySelectedCardIndex].m_ID);

                    // Disable connect mode
                    App.m_FirstCardSelectedForConnectID = -1;
                    App.m_IsConnectModeActive           = false;
                }

                break;
            }
        }

        if(!cardClicked) {
            // If any cards are currently selected
            if(App.m_CurrentlySelectedCardsIDArray.length != 0) {
                // for(A_ID = 0; A_ID < App.m_CurrentlySelectedCardsIDArray.length; A_ID++) {
                //     App.m_StoryCardsArray[App.GetStoryCardIndexByID(App.m_CurrentlySelectedCardsIDArray[A_ID])].m_IsSelected = false;
                // }

                App.m_CurrentlySelectedCardsIDArray = [];
                //App.UpdateTextEditorConfig();
            }

            // If connect mode is active and a first card has been selected
            if(App.m_IsConnectModeActive && App.m_FirstCardSelectedForConnectID != -1) {
                App.m_FirstCardSelectedForConnectID = -1;
                App.m_IsConnectModeActive           = false;
            }
        }

        App.m_LeftMouseDownCardID = -1;
    }

    this.DoRightClickDown = function(posX, posY) {
        App.m_MouseButtonsCurrentlyPressed.right = true;

        // Hide context menu
        App.HideContextMenu();

        // Set some variables to keep track of where potential drags started
        App.m_MousePoseAtStartOfClick           = { x: posX, y: posY };
        App.m_MousePoseAtStartOfPotentialDrag   = { x: posX, y: posY };
        App.m_MousePoseAtStartOfDragPersistant  = { x: posX, y: posY };
    }

    this.DoRightClickUp = function(posX, posY) {
        App.m_MouseButtonsCurrentlyPressed.right = false;

        if(!App.m_RightMouseIsDragging) {
            var localClickPosX  = posX;
            var localClickPosY  = posY;
            var cardClicked     = false;

            // Card clicked detection
            for(st = App.m_StoryCardsArray.length - 1; st >= 0; st--) {
                // Card locations are translated to the window coordinate system, offset by the header height
                // (the header-height-offset part was done before the start of this function)
                var localCardPosX   =  (App.m_StoryCardsArray[st].m_Position.x + App.m_WorldOffset.x) * App.m_WorldZoom;
                var localCardPosY   =  (App.m_StoryCardsArray[st].m_Position.y + App.m_WorldOffset.y) * App.m_WorldZoom;
                var localCardSizeX  =  (App.m_StoryCardsArray[st].m_Size.x) * App.m_WorldZoom;
                var localCardSizeY  =  (App.m_StoryCardsArray[st].m_Size.y) * App.m_WorldZoom;

                if(localClickPosX >= localCardPosX && localClickPosX <= localCardPosX + localCardSizeX &&
                    localClickPosY >= localCardPosY && localClickPosY <= localCardPosY + localCardSizeY) {
                    
                    // Clear array of IDs of selected cards
                    App.m_CurrentlySelectedCardsIDArray = [];
                    
                    // Add clicked card to array of IDs of selected cards
                    App.m_CurrentlySelectedCardsIDArray.push(App.m_StoryCardsArray[st].m_ID);
                    cardClicked = true;
                    App.ShowContextMenu(posX, posY);

                    break;
                }
            }

            if(!cardClicked) {
                // If a drag did not happen
                if(App.m_MousePoseAtStartOfDragPersistant.x == App.m_MousePoseAtStartOfPotentialDrag.x && App.m_MousePoseAtStartOfDragPersistant.y == App.m_MousePoseAtStartOfPotentialDrag.y) {
                    // If any cards are currently selected
                    if(App.m_CurrentlySelectedCardsIDArray.length != 0) {
                        // for(A_ID = 0; A_ID < App.m_CurrentlySelectedCardsIDArray.length; A_ID++) {
                        //     App.m_StoryCardsArray[App.GetStoryCardIndexByID(App.m_CurrentlySelectedCardsIDArray[A_ID])].m_IsSelected = false;
                        // }

                        App.HideContextMenu(posX, posY);

                        App.m_CurrentlySelectedCardsIDArray = [];
                    }
                }
            }
        }
    }

    this.ShowContextMenu = function(posX, posY) {
        $(".context-menu").css("display", "block");
        $(".context-menu").css("left", posX + "px");
        $(".context-menu").css("top", posY + "px");
    }

    this.HideContextMenu = function() {
        $(".context-menu").css("display", "none");
    }

    this.DoDoubleLeftClick = function(posX, posY) {
        var localClickPosX  = posX;
        var localClickPosY  = posY;
        var cardClicked     = false;

        // Hide context menu
        App.HideContextMenu();

        // Card clicked detection
        for(st = App.m_StoryCardsArray.length - 1; st >= 0; st--) {
            // Card locations are translated to the window coordinate system, offset by the header height
            // (the header-height-offset part was done before the start of this function)
            var localCardPosX   =  (App.m_StoryCardsArray[st].m_Position.x + App.m_WorldOffset.x) * App.m_WorldZoom;
            var localCardPosY   =  (App.m_StoryCardsArray[st].m_Position.y + App.m_WorldOffset.y) * App.m_WorldZoom;
            var localCardSizeX  =  (App.m_StoryCardsArray[st].m_Size.x) * App.m_WorldZoom;
            var localCardSizeY  =  (App.m_StoryCardsArray[st].m_Size.y) * App.m_WorldZoom;

            if(localClickPosX >= localCardPosX && localClickPosX <= localCardPosX + localCardSizeX &&
                localClickPosY >= localCardPosY && localClickPosY <= localCardPosY + localCardSizeY) {
                
                // Clear array of IDs of selected cards
                App.m_CurrentlySelectedCardsIDArray = [];

                // Add the double-clicked card's ID to the curr selected card IDs array
                App.m_CurrentlySelectedCardsIDArray.push(App.m_StoryCardsArray[st].m_ID);
                
                cardClicked = true;
                App.OpenTextEditor(App.m_CurrentlySelectedCardsIDArray[0]);

                if(App.m_IsConnectModeActive) {
                    // Disable connect mode
                    App.m_FirstCardSelectedForConnectID = -1;
                    App.m_IsConnectModeActive           = false;
                }

                break;
            }
        }

        if(!cardClicked) {
            // If any cards are currently selected
            if(App.m_CurrentlySelectedCardsIDArray.length != 0) {
                // for(A_ID = 0; A_ID < App.m_CurrentlySelectedCardsIDArray.length; A_ID++) {
                //     App.m_StoryCardsArray[App.GetStoryCardIndexByID(App.m_CurrentlySelectedCardsIDArray[A_ID])].m_IsSelected = false;
                // }

                App.m_CurrentlySelectedCardsIDArray = [];
                //App.UpdateTextEditorConfig();
            }
        }
    }

    // Runs after the user has finished dragging a selection box. Determines if any cards should be selected.
    this.DoSelectionDragFinish = function(startX, startY, endX, endY) {
        var dragStartX;
        var dragStartY;
        var dragEndX;
        var dragEndY;

        // Shuffle drag box corner coordinates around to be consistant for every drag direction
        if(startX > endX) {
            dragStartX  = endX;
            dragEndX    = startX;
        } else {
            dragStartX  = startX;
            dragEndX    = endX;
        }

        if(startY > endY) {
            dragStartY  = endY;
            dragEndY    = startY;
        } else {
            dragStartY  = startY;
            dragEndY    = endY;
        }

        App.m_CurrentlySelectedCardsIDArray = [];

        // Story Card "Collision" Detection
        for(LOOP_INDEXES = 0; LOOP_INDEXES < App.m_StoryCardsArray.length; LOOP_INDEXES++) {
            // Translated coordinates of the card that's currently being checked
            var TranslatedStartX    = (App.m_StoryCardsArray[LOOP_INDEXES].m_Position.x + App.m_WorldOffset.x) * App.m_WorldZoom;
            var TranslatedStartY    = (App.m_StoryCardsArray[LOOP_INDEXES].m_Position.y + App.m_WorldOffset.y) * App.m_WorldZoom;
            var TranslatedEndX      = TranslatedStartX + (App.m_StoryCardsArray[LOOP_INDEXES].m_Size.x * App.m_WorldZoom)
            var TranslatedEndY      = TranslatedStartY + (App.m_StoryCardsArray[LOOP_INDEXES].m_Size.y * App.m_WorldZoom);

            if(dragStartX < TranslatedEndX && dragEndX > TranslatedStartX && dragStartY < TranslatedEndY && dragEndY > TranslatedStartY) {
                App.m_CurrentlySelectedCardsIDArray.push(App.m_StoryCardsArray[LOOP_INDEXES].m_ID);
            }
        }
    }

    this.BuildConfiguration = function(IsForSaving) {
        var config = {
            GameName:   App.m_GameName,
            CardTypes:  App.m_CardTypes,
            FontSize:   App.ac_FontSize,
            CardTree:   []
        };

        for(currCARD = 0; currCARD < App.m_StoryCardsArray.length; currCARD++) {
            var currStoryText   = "";
            var currChoices     = [];
            var currType        = App.m_StoryCardsArray[currCARD].m_CardType;

            // Build up the currStoryTextString from the m_StoryTextArray parts of the current iterating Card
            for(StoryTextPart = 0; StoryTextPart < App.m_StoryCardsArray[currCARD].m_StoryTextArray.length; StoryTextPart++) {
                currStoryText += App.m_StoryCardsArray[currCARD].m_StoryTextArray[StoryTextPart] + " ";
            }

            // Remove extra space at the end of the currStoryText string
            currStoryText = currStoryText.slice(0, -1);

            // Iterate through all the User Choices of the current iterating Card
            for(choice = 0; choice < App.m_StoryCardsArray[currCARD].m_UserChoices.length; choice++) {
                var CurrChoiceText  = App.m_StoryCardsArray[currCARD].m_UserChoices[choice].m_ChoiceText;
                var CurrGoToIndex   = App.GetStoryCardIndexByID(App.m_StoryCardsArray[currCARD].m_UserChoices[choice].m_CardIDToGoTo);
                currChoices.push({
                    ChoiceText: CurrChoiceText,
                    GoToIndex: CurrGoToIndex
                });
            }

            // If the config is for saving the project, also add the card positions
            if(IsForSaving) {
                config.CardTree.push({
                    StoryText:  currStoryText,
                    Choices:    currChoices,
                    Type:       currType,
                    MyIndex:    currCARD,
                    Position:   App.m_StoryCardsArray[currCARD].m_Position
                });
            } else { // Else, the config is for building the app
                config.CardTree.push({
                    StoryText:  currStoryText,
                    Choices:    currChoices,
                    Type:       currType,
                    MyIndex:    currCARD
                });
            }
        }

        return config;
    }

    this.RunGame = function() {
        var config = App.BuildConfiguration();

        var html    =   "<div class='game-wrapper'>";
        html        +=      "<div class='game-story-text-wrapper'></div>";
        html        +=      "<div class='game-choice-button-wrapper'></div>";
        html        +=  "</div>";

        $.featherlight(html, {
            afterOpen: function() {
                GameApp = new AndroidParseApp();
                GameApp.Init(config);
            }
        });
    }

    this.InitEventListeners = function() {
        // Event Listeners
        $(".canvas-editor").bind('contextmenu', function(e){
            e.preventDefault();
            return false;
        });

        // Keep track of mouse position
        $("body").mousemove(function(event) {
            App.m_CurrentMouseWorldPosition.x   = (event.pageX / App.m_WorldZoom) - App.m_WorldOffset.x;
            App.m_CurrentMouseWorldPosition.y   = (event.pageY / App.m_WorldZoom) - App.m_WorldOffset.y;
        });

        // Add user choice button click
        $(".context-add-user-choice").click(function() {
            if(App.m_CurrentlySelectedCardsIDArray.length == 1) {
                App.m_StoryCardsArray[App.GetStoryCardIndexByID(App.m_CurrentlySelectedCardsIDArray[0])].AddUserChoice();
                App.HideContextMenu();
            }
        });

        // Connect to card button click
        $(".context-connect-to-card").click(function() {
            if(App.m_CurrentlySelectedCardsIDArray.length == 1) {
                // Disable Disconnect mode, in case it was active
                App.m_IsDisconnectModeActive            = false;
                App.m_FirstCardSelectedForDisconnectID  = -1;
                
                // Enable Connect mode
                App.m_IsConnectModeActive           = true;
                App.m_FirstCardSelectedForConnectID = App.m_CurrentlySelectedCardsIDArray[0];
                App.HideContextMenu();
            }
        });

        // Disconnect from card button click
        $(".context-disconnect-from-card").click(function() {
            if(App.m_CurrentlySelectedCardsIDArray.length == 1) {
                // Disable Connect mode, in case it was active
                App.m_IsConnectModeActive               = false;
                App.m_FirstCardSelectedForConnectID     = -1;

                // Enable Disconnect mode
                App.m_IsDisconnectModeActive            = true;
                App.m_FirstCardSelectedForDisconnectID  = App.m_CurrentlySelectedCardsIDArray[0];
                App.HideContextMenu();
            }
        });

        // Remove currently selected cards button click
        $(".remove-selected-cards").click(function() {
            if(App.m_CurrentlySelectedCardsIDArray.length > 0) {
                var TEMP_SELECTED_CARDS_ARRAY = Array.from(App.m_CurrentlySelectedCardsIDArray);
                for(DEL_CARD = 0; DEL_CARD < TEMP_SELECTED_CARDS_ARRAY.length; DEL_CARD++) {
                    App.RemoveStoryCard(TEMP_SELECTED_CARDS_ARRAY[DEL_CARD]);
                }
            }
        });

        $(".run-game").click(function() {
            App.RunGame();
        });

        // When key is pressed
        document.onkeydown = function (event) {
            if (event.which == 17 || event.keyCode == 17) {             // CTRL pressed
                App.m_KeysCurrentlyPressedDown.ctrl = true;
            } else if (event.which == 46 || event.keyCode == 46) {      // DELETE pressed
                if(App.m_CurrentlySelectedCardsIDArray.length > 0) {
                    var TEMP_SELECTED_CARDS_ARRAY = Array.from(App.m_CurrentlySelectedCardsIDArray);
                    for(DEL_CARD = 0; DEL_CARD < TEMP_SELECTED_CARDS_ARRAY.length; DEL_CARD++) {
                        App.RemoveStoryCard(TEMP_SELECTED_CARDS_ARRAY[DEL_CARD]);
                    }
                }
            }
        };

        // When key is released
        document.onkeyup = function (event) {
            if (event.which == 17 || event.keyCode == 17) {
                App.m_KeysCurrentlyPressedDown.ctrl = false;
            }
        };

        $(".canvas-editor").mousedown(function(e) {
            e.preventDefault();

            switch (event.which) {
                case 1:
                    // Left mouse button pressed
                    App.DoLeftClickDown(e.pageX, e.pageY);
                    break;
                case 2:
                    // Middle mouse button pressed
                    App.m_MouseButtonsCurrentlyPressed.middle = true;
                    break;
                case 3:
                    // Right mouse button pressed
                    App.DoRightClickDown(e.pageX, e.pageY);
                    break;
                default:
                    // Weird mouse
                    break;
            }
        }).mousemove(function(e) {
            e.preventDefault();

            switch(e.which) {
                case 1:
                    // If mouse is moving with left mouse button pressed
                    if(App.m_MouseButtonsCurrentlyPressed.left) {
                        App.m_LeftMouseIsDragging = true;

                        if(App.m_CurrentlySelectedCardsIDArray.length != 0) {
                            if(App.GetIsCardWithIDCurrentlySelected(App.m_LeftMouseDownCardID)) {
                                for(CURR_ID = 0; CURR_ID < App.m_CurrentlySelectedCardsIDArray.length; CURR_ID++) {
                                    var offsetX                 = (e.pageX - App.m_MousePoseAtStartOfPotentialDrag.x) / App.m_WorldZoom;
                                    var offsetY                 = (e.pageY - App.m_MousePoseAtStartOfPotentialDrag.y) / App.m_WorldZoom;
        
                                    // Move card and all it's slaves
                                    App.m_StoryCardsArray[App.GetStoryCardIndexByID(App.m_CurrentlySelectedCardsIDArray[CURR_ID])].MoveByOffset(offsetX, offsetY);
                                }
                                App.m_MousePoseAtStartOfPotentialDrag    = { x: e.pageX, y: e.pageY };
                            }
                        } else {
                            App.m_MousePoseAtStartOfPotentialDrag    = { x: e.pageX, y: e.pageY };
                        }
                    }
                    break;
                case 2:
                    // Mouse is moving with middle mouse button pressed
                    break;
                case 3:
                    // If mouse is moving with right mouse button pressed
                    if(App.m_MouseButtonsCurrentlyPressed.right) {
                        App.m_RightMouseIsDragging              = true;

                        var offsetX                     = (e.pageX - App.m_MousePoseAtStartOfPotentialDrag.x) / App.m_WorldZoom;
                        var offsetY                     = (e.pageY - App.m_MousePoseAtStartOfPotentialDrag.y) / App.m_WorldZoom;

                        App.m_WorldOffset.x                     += offsetX;
                        App.m_WorldOffset.y                     += offsetY;
                        App.m_MousePoseAtStartOfPotentialDrag   = { x: e.pageX, y: e.pageY };
                    }
            }
        }).mouseup(function(e) {
            e.preventDefault();

            switch(event.which) {
                case 1:
                    // Left mouse button lifted
                    // If no drag happened
                    if(e.pageX == App.m_MousePoseAtStartOfDragPersistant.x && e.pageY == App.m_MousePoseAtStartOfDragPersistant.y) {
                        App.DoLeftClickUp(e.pageX, e.pageY);
                    } else {
                        if(App.m_CurrentlySelectedCardsIDArray.length == 0) {
                            App.DoSelectionDragFinish(App.m_MousePoseAtStartOfDragPersistant.x, App.m_MousePoseAtStartOfDragPersistant.y, App.m_MousePoseAtStartOfPotentialDrag.x, App.m_MousePoseAtStartOfPotentialDrag.y);
                        }
                    }

                    break;
                case 2:
                    // Middle mouse button lifted
                    break
                case 3:
                    // Right mouse button lifted
                    App.DoRightClickUp(e.pageX, e.pageY);
                    break;
            }

            // Reset values
            App.m_RightMouseIsDragging              = false;
            App.m_LeftMouseIsDragging               = false;
            App.m_MousePoseAtStartOfPotentialDrag   = { x: 0, y: 0 };
            App.m_MousePoseAtStartOfDragPersistant  = { x: 0, y: 0 };
        });

        $(".canvas-editor").bind('mousewheel DOMMouseScroll', function(event){
            if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {     // Scroll up
                var OldTranslatedMouseLocation = {
                    x: (event.pageX / App.m_WorldZoom) - App.m_WorldOffset.x,
                    y: (event.pageY / App.m_WorldZoom) - App.m_WorldOffset.y
                }

                App.m_WorldZoom     *= 1.1;

                var NewTranslatedMouseLocation = {
                    x: (event.pageX / App.m_WorldZoom) - App.m_WorldOffset.x,
                    y: (event.pageY / App.m_WorldZoom) - App.m_WorldOffset.y
                }

                var DiffTranslatedMouseLocation = {
                    x: OldTranslatedMouseLocation.x - NewTranslatedMouseLocation.x,
                    y: OldTranslatedMouseLocation.y - NewTranslatedMouseLocation.y
                }

                App.m_WorldOffset.x -= DiffTranslatedMouseLocation.x;
                App.m_WorldOffset.y -= DiffTranslatedMouseLocation.y;
                
            } else {                                                                        // Scroll down
                var OldTranslatedMouseLocation = {
                    x: (event.pageX / App.m_WorldZoom) - App.m_WorldOffset.x,
                    y: (event.pageY / App.m_WorldZoom) - App.m_WorldOffset.y
                }

                App.m_WorldZoom     /= 1.1;

                var NewTranslatedMouseLocation = {
                    x: (event.pageX / App.m_WorldZoom) - App.m_WorldOffset.x,
                    y: (event.pageY / App.m_WorldZoom) - App.m_WorldOffset.y
                }

                var DiffTranslatedMouseLocation = {
                    x: OldTranslatedMouseLocation.x - NewTranslatedMouseLocation.x,
                    y: OldTranslatedMouseLocation.y - NewTranslatedMouseLocation.y
                }

                App.m_WorldOffset.x -= DiffTranslatedMouseLocation.x;
                App.m_WorldOffset.y -= DiffTranslatedMouseLocation.y;
            }
        });
    }

    this.AddStoryCard = function() {
        App.m_StoryCardsArray.push(new StoryCard());
        return App.m_StoryCardsArray[App.m_StoryCardsArray.length - 1].m_ID;
    }

    this.RemoveStoryCard = function(a_ID) {
        // App.m_CardIDCounter is the first card ID and therefore the starting Card, which should never be removed
        if(a_ID == "undefined" || a_ID == 6) {
            return;
        }

        // Text editor is open, so the 'delete' button press was probably meant for deleting text, not the card
        if(App.m_TextEditorIsOpen) {
            return;
        }

        var CardToRemoveIndex = App.GetStoryCardIndexByID(a_ID);

        for(a = 0; a < App.m_StoryCardsArray.length; a++) {
            for(b = 0; b < App.m_StoryCardsArray[a].m_UserChoices.length; b++) {
                if(App.m_StoryCardsArray[a].m_UserChoices[b].m_CardIDToGoTo == a_ID) {
                    App.m_StoryCardsArray[a].m_UserChoices.splice(b, 1);
                }
            }
        }

        App.m_StoryCardsArray.splice(CardToRemoveIndex, 1);

        
    }

    this.DeselectCard = function(a_ID) {
        if(App.GetIsCardWithIDCurrentlySelected(a_ID)) {
            var remove_index = App.m_CurrentlySelectedCardsIDArray.indexOf(a_ID)
            App.m_CurrentlySelectedCardsIDArray.splice(remove_index, 1);
        }
    }

    this.GetStoryCardIndexByID = function(CardID) {
        for(card = 0; card < App.m_StoryCardsArray.length; card++) {
            if(App.m_StoryCardsArray[card].m_ID == CardID) {
                return card;
            }
        }
    }

    this.GetIsCardWithIDCurrentlySelected = function(a_ID) {
        for(LOOP_ID = 0; LOOP_ID < App.m_CurrentlySelectedCardsIDArray.length; LOOP_ID++) {
            if(App.m_CurrentlySelectedCardsIDArray[LOOP_ID] == a_ID) {
                return true;
            }
        }
        return false;
    }

    this.OpenTextEditor = function(m_ID) {
        App.m_TextEditorIsOpen          = true;
        App.m_CurrentlyEditingCardID    = m_ID;

        var StoryText = "";
        for(stra = 0; stra < App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_StoryTextArray.length; stra++) {
            StoryText += App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_StoryTextArray[stra] + " ";
        }

        // Cut off the added space at the end of the string
        StoryText = StoryText.substring(0, StoryText.lastIndexOf(" "));

        // Load the StoryCard text into the editor
        $(".text-editor-story-text").val(StoryText);
        
        // Un-hide text-editor and accompanying label
        $(".text-editor-story-text").css("display", "block");
        $(".text-editor-story-label").css("display", "block")

        $(".text-editor-option-user-choice-wrapper").html("");
        for(choicecount = 0; choicecount < App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_UserChoices.length; choicecount++) {
            var label       = '<label>User choice ' + parseInt(choicecount + 1) + ':</label><br/>';
            var inputfield  = '<input type="text" class="text-editor-option-user-choice text-editor-option-user-choice-' + parseInt(choicecount + 1) + '"><br/>';
            $(".text-editor-option-user-choice-wrapper").append(label + inputfield);
            $(".text-editor-option-user-choice-" + parseInt(choicecount + 1)).val(App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_UserChoices[choicecount].m_ChoiceText);
        }
        
        // Depending on card type, hide or display some fields
        if(App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_CardType == App.m_CardTypes.start) {
            $("select.card-type").prop("disabled", "disabled");
            $("select.card-type").val("start");
        } else {
            $("select.card-type").prop("disabled", false);
            $("select.card-type").prop('selectedIndex', App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_CardType);
        }

        $(".text-editor").css("display", "block");
    }

    this.CloseTextEditor = function() {
        this.m_TextEditorIsOpen         = false;
        this.m_CurrentlyEditingCardID   = -1;
        $(".text-editor").css("display", "none");
    }

    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    this.AreLinesIntersecting = function(a, b, c, d, p, q, r, s) {
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }

    this.UpdateCardConfigFromTextEditor = function(m_ID) {
        if(App.m_CurrentlySelectedCardsIDArray.length != 0) {
            var StoryText                   = $(".text-editor-story-text").val();
            var NewStoryTextArray           = StoryText.split(" ");

            App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_StoryTextArray = [];

            // Save StoryText as an array to m_StoryTextArray
            for(i = 0; i < NewStoryTextArray.length; i++) {
                App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_StoryTextArray.push(NewStoryTextArray[i]);
            }

            // Save the UserChoice texts
            for(x = 0; x < App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_UserChoices.length; x++) {
                App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_UserChoices[x].m_ChoiceText = $(".text-editor-option-user-choice-" + parseInt(x + 1)).val();
            }

            // Save the card type
            App.m_StoryCardsArray[App.GetStoryCardIndexByID(m_ID)].m_CardType = $("select.card-type").prop('selectedIndex');
        }
    }

    this.Update = function() {
        App.Draw();
        if(App.m_TextEditorIsOpen) {
            App.UpdateCardConfigFromTextEditor(App.m_CurrentlyEditingCardID);
        }
    }

    this.DrawSquareOutline = function(fromX, fromY, toX, toY, border_color) {
        App.m_Context.strokeStyle = border_color;

        App.m_Context.lineWidth = 1;
        App.m_Context.beginPath();
        App.m_Context.moveTo(fromX, fromY);
        App.m_Context.lineTo(toX, fromY);
        App.m_Context.lineTo(toX, toY);
        App.m_Context.lineTo(fromX, toY);
        App.m_Context.lineTo(fromX, fromY);
        App.m_Context.stroke();
    }

    this.Draw = function() {
        App.m_Context.clearRect(0, 0, 10000, 10000);

        for(i = 0; i < App.m_StoryCardsArray.length; i++) {
            App.m_StoryCardsArray[i].DrawLines();
        }

        for(i = 0; i < App.m_StoryCardsArray.length; i++) {
            App.m_StoryCardsArray[i].Draw();
        }

        if(App.m_LeftMouseIsDragging && App.m_CurrentlySelectedCardsIDArray.length == 0) {
            App.DrawSquareOutline(App.m_MousePoseAtStartOfDragPersistant.x, App.m_MousePoseAtStartOfDragPersistant.y, App.m_MousePoseAtStartOfPotentialDrag.x, App.m_MousePoseAtStartOfPotentialDrag.y, 'black')
        }
    }
}


var App;


$("body").ready(function() {
    UpdateWindowLayout();

    window.setInterval(function() {
        UpdateWindowLayout();
    }, 100);

    App = new MakerApp();
    App.Init();
});

// Update all major elements to fit on the webpage
function UpdateWindowLayout() {
    var headerHeight        = $(".header-item").height();
    var headerLinkHeight    = $(".header-link").height();
    $(".header-item").css("line-height", headerHeight + "px");
    $(".header-link").css("padding-top", (headerHeight - headerLinkHeight) / 2 + "px");
    $(".header-link").css("padding-bottom", (headerHeight - headerLinkHeight) / 2 + "px");

    var ctx                 = document.getElementById('canvas-editor').getContext('2d');
    if(Math.floor(ctx.canvas.width) !== Math.floor(window.innerWidth)) {
        ctx.canvas.width    = Math.floor(window.innerWidth);
    } if(Math.floor(ctx.canvas.height) !== Math.floor(window.innerHeight)) {
        ctx.canvas.height   = Math.floor(window.innerHeight);
    }
}