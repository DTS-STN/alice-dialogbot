// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { SlotDetails } = require('./slotDetails');
const { SlotFillingDialog } = require('./slotFillingDialog');

const TEXT_PROMPT = 'TEXT_PROMPT';

class RootDialog extends ComponentDialog {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(userState) {
        super('root');
        // Create a property used to store dialog state.
        // See https://aka.ms/about-bot-state-accessors to learn more about bot state and state accessors.
        this.userStateAccessor = userState.createProperty('result');

        // Set up a series of questions for collecting the user's name.
        // const firstNameSlots = [
        //     new SlotDetails('first', 'text', 'What is your first name.')
        // ];
        // const lastNameSlots = [
        //     new SlotDetails('last', 'text', 'What is your last name.')
        // ];

        // const emailAddressSlots = [
        //     new SlotDetails('email', 'text', 'What is your email address.')
        // ];

        // const passwordSlots = [
        //     new SlotDetails('password', 'text', 'What is your password.')
        // ];

        // Set up a series of questions to collect a street address.
        const addressSlots = [
            new SlotDetails('street', 'text', 'Please enter your street address.'),
            new SlotDetails('city', 'text', 'Please enter the city.'),
            new SlotDetails('zip', 'text', 'Please enter your zipcode.')
        ];

        // Link the questions together into a parent group that contains references
        // to both the fullname and address questions defined above.
        const slots = [
            new SlotDetails('What is your first Name','text', 'What is your first Name'),
            new SlotDetails('What is your last Name','text', 'What is your last Name'),
            new SlotDetails('email', 'text', 'What is your email address.'),
            new SlotDetails('password', 'text', 'What is your password.')
            // new SlotDetails('shoesize', 'shoesize', 'Please enter your shoe size.', 'You must enter a size between 0 and 16. Half sizes are acceptable.'),
            // new SlotDetails('address', 'address')
        ];

        // Add the individual child dialogs and prompts used.
        // Note that the built-in prompts work hand-in-hand with our custom SlotFillingDialog class
        // because they are both based on the provided Dialog class.
     //  this.addDialog(new SlotFillingDialog('address', addressSlots));
    //    this.addDialog(new SlotFillingDialog('What is your first Name', firstNameSlots));
    //    this.addDialog(new SlotFillingDialog('What is your last Name', lastNameSlots));
    //    this.addDialog(new SlotFillingDialog('What is your email address', emailAddressSlots));
    //    this.addDialog(new SlotFillingDialog('What is your password', passwordSlots));
        this.addDialog(new TextPrompt('text'));
      //  this.addDialog(new NumberPrompt('number'));
        // this.addDialog(new NumberPrompt('shoesize', this.shoeSizeValidator));
       this.addDialog(new SlotFillingDialog('user-dialog', slots));
       

        // Finally, add a 2-step WaterfallDialog that will initiate the SlotFillingDialog,
        // and then collect and display the results.
        this.addDialog(new WaterfallDialog('root', [
            this.startDialog.bind(this),
          //  this.addDialog(new TextPrompt(TEXT_PROMPT)),
          //  this.nameStep.bind(this),
          this.processResults.bind(this)
        ]));

        this.initialDialogId = 'root';
    }

    async nameStep(stepContext) {
        // Create an object in which to collect the user's information within the dialog.
      //  stepContext.values.userInfo = new UserProfile();

        const promptOptions = { prompt: 'Thanks for the informaton.' };

        // Ask the user to enter their name.
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    }
    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} dialogContext
     */
    async run(context, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    // This is the first step of the WaterfallDialog.
    // It kicks off the dialog with the multi-question SlotFillingDialog,
    // then passes the aggregated results on to the next step.
    async startDialog(step) {
        return await step.beginDialog('user-dialog');
    }

    // This is the second step of the WaterfallDialog.
    // It receives the results of the SlotFillingDialog and displays them.
    async processResults(step) {
        // Each "slot" in the SlotFillingDialog is represented by a field in step.result.values.
        // The complex that contain subfields have their own .values field containing the sub-values.
        // const values = step.result.values;

        // const firstname = values.firstname.values;
        // const lastname = values.lastname.values;
        // await step.context.sendActivity(`Your name is ${ firstname.first } ${ lastname.last }.`);

        // await step.context.sendActivity(`You wear a size ${ values.shoesize } shoes.`);

        // const address = values.address.values;
        // await step.context.sendActivity(`Your address is: ${ address.street }, ${ address.city } ${ address.zip }`);
      await step.context.sendActivity(`Thank you for providing your Information.`);
      return await step.endDialog(step.result);
    }
    

    // Validate that the provided shoe size is between 0 and 16, and allow half steps.
    // This is used to instantiate a specialized NumberPrompt.
    async shoeSizeValidator(prompt) {
        if (prompt.recognized.succeeded) {
            const shoesize = prompt.recognized.value;

            // Shoe sizes can range from 0 to 16.
            if (shoesize >= 0 && shoesize <= 16) {
                // We only accept round numbers or half sizes.
                if (Math.floor(shoesize) === shoesize || Math.floor(shoesize * 2) === shoesize * 2) {
                    // Indicate success.
                    return true;
                }
            }
        }

        return false;
    }
}

module.exports.RootDialog = RootDialog;
