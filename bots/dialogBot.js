// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

// cosmosDB connection end points
//const COSMOSDB_END_POINTS= "https://localhost:8081"
// cosmosDB authenticaton key
//const COSMOSDB_AUTHENTICATION_KEY="C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
// cosmosDB database id
//const DATABASE_ID= "TestBotDB"
// cosmosDB container id
//const CONTAINER_ID ="TestContainer"

// configer and execute requests in the cosmosDB database service
//const CosmosClient = require('@azure/cosmos').CosmosClient

// create a new cosmosclient object from connetction string
// const CLIENT = new CosmosClient({
//     endpoint: COSMOSDB_END_POINTS,
//     key: COSMOSDB_AUTHENTICATION_KEY,
//     userAgentSuffix: 'CosmosDBJavascriptQuickstart',
//     rejectUnauthorized: false,
//     strictSSL: false
// });

// async function createNewItem(itemBody) {
//     const { item } = await CLIENT
//       .database(DATABASE_ID)
//       .container(CONTAINER_ID)
//       .items.upsert(itemBody)
//     //   console.log("item >>>>", item)
//     // console.log(`Created family item with id:\n${itemBody.id}\n`)
//   }

const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';


class DialogBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');
        this.userProfile= this.userState.createProperty('userProfile')

       // this.conversationData = this.conversationState.createProperty();
       // this.userProfile = this.userState.createProperty(USER_PROFILE_PROPERTY);

        this.onMessage(async (context, next) => {
        
            // Run the Dialog with the new message Activity.
            await this.dialog.run(context, this.dialogState);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, true);
        await this.userState.saveChanges(context, false);
    }
    
}

module.exports.DialogBot = DialogBot;
