In this design we will clean up a number of features within the UI and game systems:
1. Add scrolling to the server and channel list, if possible prevent the scroll bar from appearing when users scroll these elements though
2. Expand the width of the control panel element to allow more information to be shown
3. Round purchase costs, user counts, and number of messages to nearest magnitude (k, m, b, etc)
4. Improve the simulation logic so each user has a chance to post a message in a random channel each tick
5. Improve the simulation logic so that bits are tracked as a floating point but only displayed as a whole number
6. Create a central storage location so that all json files are only loaded once and then cached by the client