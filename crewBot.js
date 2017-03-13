/*   COPYRIGHT KALEB WASMUTH, 2017. ALL RIGHTS RESERVED.
     ORIGINALLY DESIGNED FOR USE BY THE LIFEBOAT NETWORK ™
*/

//   Global Variables

// Root Panel. Enable/Disable commands here.

// Trainee Commands
const testEn = true;
const helpEn =  true;
const menuEn = true;
const getPermEn = true;
const startEn = true;
const adminsEn = true;

// Moderator Admin Commands
const addModeratorEn = true;
const addTraineeEn = true;

// Builder Admin Commands
const addBuilderEn = true;

// Artist Admin Commands
const addArtistEn = true;

// Multi-Admin Commands
const addMemberEn = true;
const editMemberEn = true;
const addRoleEn = true;
const delRoleEn = true;
const viewMemberEn = true;
const addNoteEn = true;
const editNoteEn = true;
const delNoteEn = true;
const getDirectoryEn = true;
const searchEn = true;

// Global Admin Commands
const setPermEn = true;
const delPermEn = true;
const delMemberEn = true;



// Constants
const versionNumber = '1.0.2';
const versionMsg = 'Added senior moderator role';
const logMaxCount = 100;
const doDelOldLogs = false;
const keepDeletedProfiles = true;
// This permission can only be hard-coded.
const globalAdminPerm = ['kaleb418', 'luke_hoffman', 'jiselleangeles', 'ciamouse'];

var makeListVar = '';

//   Global Object Constructors

// New Note
function Note(text, sender, dateSent, isHidden, ID){
    this.text = text;
    this.sender = sender;
    this.dateSent = dateSent;
    this.isHidden = isHidden;
    this.ID = ID;
}

// New Member
function Member(name, IGN, IP, adder, dateAdded, lastUpdated, allNotes, publicNotes, noteNumber, role, username){
    this.public = {
        name: name,
        IGN: IGN,
        adder: adder,
        dateAdded: dateAdded,
        publicNotes: publicNotes
    };
    this.private = {
        IP: IP,
        allNotes: allNotes
    };
    this.backend = {
        lastUpdated: lastUpdated,
        noteNumber: noteNumber,
        role: role,
        username: username
    };
}

//   Global Functions

// Get Current Date
function getDate(dateObj){
    var dateUpdated = (dateObj.getMonth() + 1) + '/' + (dateObj.getDate()) + '/' + (dateObj.getFullYear());
    return dateUpdated;
}

// Get Current Full Date
function getFullDate(dateObj){
    if(dateObj.getMinutes() < 10){
        var minutes = '0' + (dateObj.getMinutes()).toString();
    }else{
        var minutes = (dateObj.getMinutes()).toString();
    }
    var dateUpdated = (dateObj.getMonth() + 1) + '/' + (dateObj.getDate()) + '/' + (dateObj.getFullYear()) + ' ' + (dateObj.getHours() + 1) + ':' + minutes;
    return dateUpdated;
}

// Check if a value exists in an array, and return an array with true/false and the index (null if false)
function isInArray(value, array){
    var isInThis = false;
    for(var x in array){
        if(value === array[x]){
            isInThis = true;
            break;
        }else{
            // Do Nothing
        }
    }
    
    if(isInThis){
        var returnedIndexOfValue = array.indexOf(value);
    }else{
        var returnedIndexOfValue = null;
    }
    
    return [isInThis, returnedIndexOfValue];
}

// Get User's Permission, Returns Number 0-5
function getPermNode(user){
    /*
    
    PERMISSIONS:
    0 :: Global Admin
    1 :: Moderator Admin
    2 :: Builder Admin
    3 :: Artist Admin
    4 :: Moderator
    5 :: Default User
    
    */
    // Global Admin Permission
    if((isInArray(user, globalAdminPerm))[0]){
        return 0;
    }
    // Moderator Admin Permission
    else if((isInArray(user, context.simpledb.botleveldata.modAdminPerm))[0]){
        return 1;
    }
    // Builder Admin Permission
    else if((isInArray(user, context.simpledb.botleveldata.builderAdminPerm))[0]){
        return 2;
    }
    // Artist Admin Permission
    else if((isInArray(user, context.simpledb.botleveldata.artistAdminPerm))[0]){
        return 3;
    }
    // Moderator Permission
    else if((isInArray(user, context.simpledb.botleveldata.modPerm))[0]){
        return 4;
    }
    // Default User Permission
    else{
        return 5;
    }
}

// Gets user's permission node in words.
function getLetterNode(userPerm){
    switch(userPerm){
        case 0: // Global Admin
            var permInLetters = 'Global Admin';
            break;
        case 1: // Moderator Admin
            var permInLetters = 'Moderator Admin';
            break;
        case 2: // Builder Admin
            var permInLetters = 'Builder Admin';
            break;
        case 3: // Artist Admin
            var permInLetters = 'Artist Admin';
            break;
        case 4: // Moderator
            var permInLetters = 'Moderator';
            break;
        default: // Default User
            var permInLetters = 'Default User';
    }
    return permInLetters;
}

// Get User's perm in literal form
function getLiteralPerm(userPerm){
    switch(userPerm){
        case 0: // Global Admin
            var literalPerm = 'globalAdminPerm';
            break;
        case 1: // Moderator Admin
            var literalPerm = 'modAdminPerm';
            break;
        case 2: // Builder Admin
            var literalPerm = 'builderAdminPerm';
            break;
        case 3: // Artist Admin
            var literalPerm = 'artistAdminPerm';
            break;
        case 4: // Moderator
            var literalPerm = 'modPerm';
            break;
        default: // Default User
            var literalPerm = 'defaultUser';
    }
    return literalPerm;
}

// Send Permission Error
function permError(userPerm){
    var permWords = getLetterNode(userPerm);
    context.sendResponse(':warning: Error: Incorrect Permissions. Your permission node is *' + userPerm + ' (' + permWords + ')*. Please contact KaIeb if you think this is in error.');
}

// Send Disabled Command Error
function enError(){
    context.sendResponse(':warning: Error: This command has been disabled.');
}

// Add Log
function addLog(event/*BECAUSE EVENT IS NOT YET DEFINED*/, sender, text, timeSent){
    var logList = context.simpledb.botleveldata.logs;
    logList.unshift('*' + sender + ' at ' + timeSent + ':* ' + text);
    context.simpledb.botleveldata.logs = logList;
    return true;
}

// Delete Last Log
function delLastLog(event/*BECAUSE EVENT IS NOT YET DEFINED*/){
    // IF MORE THAN 100 LOGS
    if(context.simpledb.botleveldata.logs.length > logMaxCount){
        var logList = context.simpledb.botleveldata.logs;
        logList.length = logMaxCount; // Remove logs after 100th one
        context.simpledb.botleveldata.logs = logList;
        return true;
    }else{
        // Do Nothing
        return false;
    }
}

// Update Log List
function updateLogs(event/*BECAUSE EVENT IS NOT YET DEFINED*/){
    addLog(event, event.senderobj.subdisplay, event.message, getFullDate(new Date()));
    if(doDelOldLogs){
        delLastLog(event);
    }
    return true;
}

// Loop Through Command To Return Parsed Value And Return Last Known Comma Index
function parseCommand(thingToParse, startingNum, conditionalNum, defaultReturn){
    var makeListVar = defaultReturn;
    for(var i = startingNum; i < conditionalNum; i++){
        if(thingToParse[i] !== '"'){
            makeListVar = makeListVar + thingToParse[i];
        }else{
            var lastKnownComma = i; 
            break;
        }
    }
    return [makeListVar, lastKnownComma];
}

// Return all permission nodes a user is in (should just be one unless a bug occured or we are checking roles of a profile)
function getAllNodes(user){
    var allNodes = [];
    var isGlobalAdmin = false;
    var isModAdmin = false;
    var isBuilderAdmin = false;
    var isArtistAdmin = false;
    var isModerator = false;
    var isDefaultUser = false;
    
    if((isInArray(user, globalAdminPerm))[0]){
        var isGlobalAdmin = true;
        allNodes.push('Global Admin');
    }
    if((isInArray(user, context.simpledb.botleveldata.modAdminPerm))[0]){
        var isModAdmin = true;
        allNodes.push('Moderator Admin');
    }
    if((isInArray(user, context.simpledb.botleveldata.builderAdminPerm))[0]){
        var isBuilderAdmin = true;
        allNodes.push('Builder Admin');
    }
    if((isInArray(user, context.simpledb.botleveldata.artistAdminPerm))[0]){
        var isArtistAdmin = true;
        allNodes.push('Artist Admin');
    }
    if((isInArray(user, context.simpledb.botleveldata.modPerm))[0]){
        var isModerator = true;
        allNodes.push('Moderator');
    }
    
    if((!isGlobalAdmin) && (!isModAdmin) && (!isBuilderAdmin) && (!isArtistAdmin) && (!isModerator)){
        var isDefaultUser = true;
        allNodes.push('Default User');
    }
    return allNodes;
}

function updateCounts(resultOfPermCheck){
    switch(resultOfPermCheck){
        case 0:
            context.simpledb.botleveldata.timesused++;
            context.simpledb.botleveldata.timesadminused++;
            break;
        case 1:
            context.simpledb.botleveldata.timesused++;
            context.simpledb.botleveldata.timesmodadminused++;
            break;
        case 2:
            context.simpledb.botleveldata.timesused++;
            context.simpledb.botleveldata.timesbuilderadminused++;
            break;
        case 3:
            context.simpledb.botleveldata.timesused++;
            context.simpledb.botleveldata.timesartistadminused++;
            break;
        case 4:
            context.simpledb.botleveldata.timesused++;
            context.simpledb.botleveldata.timesmodused++;
            break;
        default:
            context.simpledb.botleveldata.timesused++;
            context.simpledb.botleveldata.timestraineeused++;
            break;
    }
    
}

// Returns true if sender can edit the target's profile (isn't reliable for default users)
function canEdit(senderPerm, target){
    var targetPerm = getPermNode(target);
    var targetObj = context.simpledb.botleveldata.members[target];
    if(((senderPerm === 0) || (senderPerm === 1 && targetPerm === 5)) || (((senderPerm === 2 && targetPerm === 5) || (senderPerm === 3 && targetPerm === 5)) || (senderPerm === 4 && targetPerm === 5))){
        if(targetPerm === 5 && senderPerm !== 0){
            var canEditThis = false;
            if((isInArray('Moderator', targetObj.backend.role))[0]){
                if(senderPerm === 1 || senderPerm === 0){
                    canEditThis = true;
                }else{
                    if(!canEditThis){
                        canEditThis = false; // This if/else statement probably doesn't need to be here, but I have no reason to remove it.
                    }
                }
            }
            
            if((isInArray('Trainee', targetObj.backend.role))[0]){
                if(senderPerm === 1 || senderPerm === 0){
                    canEditThis = true;
                }else{
                    if(!canEditThis){
                        canEditThis = false; // This if/else statement probably doesn't need to be here, but I have no reason to remove it.
                    }
                }
            }
            
            if((isInArray('Builder', targetObj.backend.role))[0]){
                if(senderPerm === 2 || senderPerm === 0){
                    canEditThis = true;
                }else{
                    if(!canEditThis){
                        canEditThis = false; // This if/else statement probably doesn't need to be here, but I have no reason to remove it.
                    }
                }
            }
            
            if((isInArray('Artist', targetObj.backend.role))[0]){
                if(senderPerm === 3 || senderPerm === 0){
                    canEditThis = true;
                }else{
                    if(!canEditThis){
                        canEditThis = false; // This if/else statement probably doesn't need to be here, but I have no reason to remove it.
                    }
                }
            }
            return canEditThis;
        }else{
            return true;
        }
    }else{
        return false;
    }
}

function presentArray(array){
    var makeListVar = '';
    for(var x in array){
        if(x !== 0){
            makeListVar = makeListVar + '\n>' + array[x];
        }else{
            makeListVar = makeListVar + array[x];
        }
    }
    return makeListVar;
}

function getSrModerators(){
    var makeListVar = [];
    for(var x in context.simpledb.botleveldata.members){
        var abc = context.simpledb.botleveldata.members[x];
        if((isInArray('Senior Moderator', abc.backend.role))[0]){
            makeListVar.push(abc.backend.username);
        }
    }
    return makeListVar;
}

function getModerators(){
    var makeListVar = [];
    for(var x in context.simpledb.botleveldata.members){
        var abc = context.simpledb.botleveldata.members[x];
        if((isInArray('Moderator', abc.backend.role))[0]){
            makeListVar.push(abc.backend.username);
        }
    }
    return makeListVar;
}

function getTrainees(){
    var makeListVar = [];
    for(var x in context.simpledb.botleveldata.members){
        var abc = context.simpledb.botleveldata.members[x];
        if((isInArray('Trainee', abc.backend.role))[0]){
            makeListVar.push(abc.backend.username);
        }
    }
    return makeListVar;
}

function getBuilders(){
    var makeListVar = [];
    for(var x in context.simpledb.botleveldata.members){
        var abc = context.simpledb.botleveldata.members[x];
        if((isInArray('Builder', abc.backend.role))[0]){
            makeListVar.push(abc.backend.username);
        }
    }
    return makeListVar;
}

function getArtists(){
    var makeListVar = [];
    for(var x in context.simpledb.botleveldata.members){
        var abc = context.simpledb.botleveldata.members[x];
        if((isInArray('Artist', abc.backend.role))[0]){
            makeListVar.push(abc.backend.username);
        }
    }
    return makeListVar;
}

function searchField(field, value, resultOfPermCheck /*BECAUSE RESULTOFPERMCHECK IS NOT YET DEFINED*/){
    var makeListVar = [];
    if(field === 'IP'){
        // Search private
        for(var x in context.simpledb.botleveldata.members){
            var abc = context.simpledb.botleveldata.members[x];
            var newDef = abc.private.IP.toLowerCase();
            if(newDef.includes(value.toLowerCase())){
                if(canEdit(resultOfPermCheck, abc.backend.username)){
                    makeListVar.push('*' + abc.backend.username + '*' + '\n>*Value:* ' + abc.private.IP);
                }
            }
        }
        return makeListVar;
        
    }
    else if(field === 'name' || field === 'IGN'){
        // Search public
        
        for(var x in context.simpledb.botleveldata.members){
            var abc = context.simpledb.botleveldata.members[x];
            var def = abc.public[field];
            newDef = def.toLowerCase();
            if(newDef.includes(value.toLowerCase())){
                makeListVar.push('*' + abc.backend.username + '*' + '\n>*Value:* ' + def);
            }
        }
        return makeListVar;
        
    }else{
        context.sendResponse(':warning: Error: Please specify a valid subcommand (name, IGN, IP).');
        return null;
    }
}

function MessageHandler(context, event) {
    const resultOfPermCheck = getPermNode(event.senderobj.subdisplay);
    if(event.message !== undefined){
        if(event.message[0] === '$'){
            
            if(event.message === '$test' || event.message === '$$'){
                if(testEn){
                    updateLogs(event);
                    
                    context.sendResponse('Test successful! Message handler is responsive!\n\n*Times Used:* ' + context.simpledb.botleveldata.timesused + '\n*Times Global Admin Used:* ' + context.simpledb.botleveldata.timesadminused + '\n*Times Moderator Admin Used:* ' + context.simpledb.botleveldata.timesmodadminused + '\n*Times Builder Admin Used:* ' + context.simpledb.botleveldata.timesbuilderadminused + '\n*Times Artist Admin Used:* ' + context.simpledb.botleveldata.timesartistadminused + '\n*Times Moderator Used:* ' + context.simpledb.botleveldata.timesmodused + '\n*Times Default User Used:* ' + context.simpledb.botleveldata.timestraineeused + '\n\n*Current Version:* ' + versionNumber + ' (' + versionMsg + ')' + '\n\nThis bot was created and published by <@U1JT6HNE5>. Contact him for any questions or concerns you may have.');
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message === '$help'){
                if(helpEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    context.sendResponse('Hello, ' + event.senderobj.display + '. Glad I could help. My name is Crew Bot. My job is to help you learn more about the Lifeboat crew. To get started, send me `$menu`.\n*This bot was created by <@U1JT6HNE5>.*');
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message === '$menu'){
                if(menuEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    const defaultUserPermList = 'Test Bot : : `$test`\nHelp Message : : `$help`\nMain Menu : : `$menu`\nGet Started : : `$start`\nView Admins : : `$admins`\n\nGet Permissions : : `$getPerm`';
                    
                    const moderatorPermList = 'Test Bot : : `$test`\nHelp Message : : `$help`\nMain Menu : : `$menu`\nGet Started : : `$start`\nView Admins : : `$admins`\n\nGet Permissions : : `$getPerm`\n\nAdd Member : : `$addMember`\nGet Directory : : `$getDirectory`\nSearch Directory : : `$search`\nView Profile : : `$viewMember`\n\nAdd Role : : `$addRole`\nDelete Role : : `$delRole`\n\nAdd Note : : `$addNote`\nEdit Note : : `$editNote`\nDelete Note : : `$delNote`';
                    
                    const artistAdminPermList = 'Test Bot : : `$test`\nHelp Message : : `$help`\nMain Menu : : `$menu`\nGet Started : : `$start`\nView Admins : : `$admins`\n\nGet Permissions : : `$getPerm`\n\nAdd Member : : `$addMember`\nAdd Artist : : `$addArtist`\nGet Directory : : `$getDirectory`\nSearch Directory : : `$search`\nView Profile : : `$viewMember`\n\nAdd Role : : `$addRole`\nDelete Role : : `$delRole`\n\nAdd Note : : `$addNote`\nEdit Note : : `$editNote`\nDelete Note : : `$delNote`';
                    
                    const builderAdminPermList = 'Test Bot : : `$test`\nHelp Message : : `$help`\nMain Menu : : `$menu`\nGet Started : : `$start`\nView Admins : : `$admins`\n\nGet Permissions : : `$getPerm`\n\nAdd Member : : `$addMember`\nAdd Builder : : `$addBuilder`\nGet Directory : : `$getDirectory`\nSearch Directory : : `$search`\nView Profile : : `$viewMember`\n\nAdd Role : : `$addRole`\nDelete Role : : `$delRole`\n\nAdd Note : : `$addNote`\nEdit Note : : `$editNote`\nDelete Note : : `$delNote`';
                    
                    const modAdminPermList = 'Test Bot : : `$test`\nHelp Message : : `$help`\nMain Menu : : `$menu`\nGet Started : : `$start`\nView Admins : : `$admins`\n\nGet Permissions : : `$getPerm`\n\nAdd Member : : `$addMember`\nGet Directory : : `$getDirectory`\nSearch Directory : : `$search`\nView Profile : : `$viewMember`';
                    
                    const globalAdminPermList = 'Test Bot : : `$test`\nHelp Message : : `$help`\nMain Menu : : `$menu`\nGet Started : : `$start`\nView Admins : : `$admins`\n\nGet Permissions : : `$getPerm`\nAdd Permissions : : `$setPerm`\nDelete Permissions : : `$delPerm`\n\nAdd Member : : `$addMember`\nAdd Moderator : : `$addModerator`\nAdd Trainee : : `$addTrainee`\nAdd Builder : : `$addBuilder`\nAdd Artist : : `$addArtist`\nGet Directory : : `$getDirectory`\nSearch Directory : : `$search`\nView Profile : : `$viewMember`\n\nAdd Role : : `$addRole`\nDelete Role : : `$delRole`\n\nAdd Note : : `$addNote`\nEdit Note : : `$editNote`\nDelete Note : : `$delNote`';
                    
                        // Send commands that are related to permissionNode
                        switch(resultOfPermCheck){
                            case 0: // Global Admin
                                context.sendResponse(globalAdminPermList);
                                break;
                            case 1: // Moderator Admin
                                context.sendResponse(modAdminPermList);
                                break;
                            case 2: // Builder Admin
                                context.sendResponse(builderAdminPermList);
                                break;
                            case 3: // Artist Admin
                                context.sendResponse(artistAdminPermList);
                                break;
                            case 4: // Moderator
                                context.sendResponse(moderatorPermList);
                                break;
                            default: // Default User (5)
                                context.sendResponse(defaultUserPermList)
                                break;
                        }
                    
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 8) === '$getPerm'){
                if(getPermEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(event.message === '$getPerm'){
                            context.sendResponse('*Permission node for ' + event.senderobj.subdisplay + ':* ' + resultOfPermCheck + ' (' + getLetterNode(resultOfPermCheck) + ')');
                    }
                    if(event.message[8] === ' ' && event.message[9] === '"'){
                        // Check that user isn't default user.
                        if(resultOfPermCheck < 5){
                            var firstParse = parseCommand(event.message, 10, event.message.length, '');
                            var firstArg = firstParse[0];
                            
                            if(event.message[event.message.length - 1] === '"'){
                                context.sendResponse('*Permission node for ' + firstArg + ':* ' + getPermNode(firstArg) + ' (' + getLetterNode(getPermNode(firstArg)) + ')');
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$getPerm`\n*OR*\n`$getPerm "username"`');
                            }
                        }else{
                            permError(resultOfPermCheck);
                        }
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 6) === '$start'){
                if(startEn){
                    
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(event.message === '$start'){
                        context.sendResponse('Please specify a tag, -t for trainee, -b for builder, and -a for artist. Example: `$start -t`');
                    }else{
                        if(event.message === '$start -t'){
                            context.sendResponse('Hey there! I would like to welcome you to a program that you will be involved in for the next 1-3 weeks of your Lifeboat experience. Here at Lifeboat, we strive to provide the best server experience possible. We have a player base of 29 million accounts, ranging from very young children to adults and parents. We have over 100 different servers, and over 10 gamemodes to choose from. We are the largest *Minecraft: Pocket Edition* server community, and have been the largest Minecraft network community above all Minecraft servers, PE and PC. Of course, with this huge player fanbase, there comes a huge responsibility. Part of that responsibility is making sure our players are enjoying their time on our servers, and aren\'t experiencing problems. Thus we introduced moderators to our servers.\n\nSomething we must be exceptionally clear on: Moderators do *NOT* exist to boss players around. They do not exist to tell players what to do. They do not exist to make a Lifeboat player\'s experience miserable. They are our line of defense against players who refuse to follow rules. Another thing we try to tell our moderators often is that we must *always* warn with correction before punishment. What good is punishing a player if they don\'t learn anything? We strive to verbally warn and correct a player when they are breaking our rules, so that they learn from their mistakes. Moderator tools are only necessary when a player defies a moderator\'s request to play by the rules of our servers. Then, and only then, are we to use the necessary force, and only in incremental amounts, usually starting with a mute, then working the way up to a 10 minute ban, and so on, if the player refuses to obey after the mute. However, a moderator should never be afraid to use his or her tools at their disposal. If a player continously disobeys correction, we must act according to the severity of the punishment. There are two exceptions to this rule: Hacking and inappropriate names. If you encounter a hacker or a user with a swear word in his name, please ban him for a full day (/lbban <player> 1440), and report him on Redmine.\n\nHere\'s a checklist for you to use, please make sure you complete all of these things before you move on:\n\n- Sign the volunteer agreement form.\n- Have the crew tag added to your Lifeboat account.\n- Have an admin set up a Redmine account for you.\n\n*If you need help with any of the above things, please talk to an administrator. You can see all admins by sending `$admins`.*\n\nHere are the moderator tools you\'ll be working with once you become a full moderator. *Please note:* Trainees do *NOT* have access to these tools; they are here for you to learn them and know how to use them for when you graduate.\n\n`/lbban` - The main moderator command. Follow `/lbban` with `<player> <time-in-minutes|skin|warn> [reason (optional)]`. For example, if I were to ban myself (elite041802) for 15 minutes for reason: hacking, I would use `/lbban elite041802 15 Hacking`.\n\n`/lbban <player> skin` - Replaces a players current skin with its Alex or Steve counterparts.\n\n`/lbban <player> warn` - Warns the player that they are using inappropriate conduct and mutes them for five minutes.\n\n`/mod fly` - Toggles invisibility and flying ability.\n\n`/separate <player1> <player2>` - Bounces the two specified players back from each other and prevents them from seeing each other\'s chat messages.\n\n`/move <player>` - Teleports you to the specified player or coordinates.\n\nPlease note that the only command you\'ll have when you\'re a trainee is `/d`, which hides your skin and name from others.\n\nTo report players in-game, please use Redmine (crew.lbsg.net). If you need help with reporting, let an administrator know.\n\nLast, but not least, have fun! We\'re glad to have you as part of the volunteer team here, and have high hopes for you. Feel free to watch this introductory greeting, if you wish. https://www.youtube.com/watch?v=Butvl6MzG50&feature=youtu.be');
                        }
                        else if(event.message === '$start -b'){
                            context.sendResponse('Hello, and welcome to the Lifeboat build team! Here at Lifeboat, we strive to provide the best server experience possible. We have a player base of 29 million accounts, ranging from very young children to adults and parents. We have over 100 different servers, and over 10 gamemodes to choose from. We are the largest *Minecraft: Pocket Edition* server community, and have been the largest Minecraft network community above all Minecraft servers, PE and PC. Of course, with this huge player fanbase, there comes a huge responsibility. Part of that responsibility is making sure our players get new and awesome maps to play on frequently. Thus we introduced the build team!\n\nLifeboat’s build team at its core is, well, a team! We work together with the common goal to create awesome environments for our players to experience. Even though there some may have one specific build style that they are good at, or one specific game they make maps for, we all work to improve both the network and our teammates. Creativity and the ability to build well are extremely important for members of the build team, however the ability to work with others is of utmost importance.\n\nWe put a lot of effort into giving our build team the tools to make their lives easier and create an environment where their creativity is not limited. We have both a PE map building server and a PC map building server. You as a builder are welcome to use either server to your liking. We also use Trello for project organization. It is both a web-based and app-based platform so feel free to download it on your phone or just go to https://trello.com.\n\nHere are the action points that you should follow after reading this message.\n\n- Sign the volunteer agreement form.\n- Have the “Map” tag added to your Lifeboat account.\n- Have a Lead Builder introduce you to Trello.\n\n*If you need help with any of the above things, please talk to an administrator. You can see all admins by sending `$admins`.*\n\nFinally, have fun! We are here to create awesome maps for our players to experience and it feels amazing getting to watch people play on your creations. We hope you enjoy it here! ');
                        }
                        else if(event.message === '$start -a'){
                            context.sendResponse('Hello! Welcome to the Lifeboat artists team. Here is a checklist for you to complete to get set up:\n\n- Sign the volunteer agreement form.\n- Have the crew tag added to your Lifeboat account.\n- Have an admin set up a Redmine (crew.lbsg.net) account for you.\n\nIf you have any trouble completing these things, feel free to ask an administrator for help. Send `$admins` to view the admins.');
                        }
                        else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$start`\n*OR*\n`$start <tag>`');
                        }
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message === '$admins'){
                if(adminsEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    context.sendResponse('Rein Teder (<@U1K133MFC>) - *President of Hydreon Corp.*\nBen Gryskiewicz (<@U3L62DW31>) - *Staff Manager*\nLuke Hoffman (<@U1EFX07SP>) - *Volunteer Leader*\nJiselle Angeles (<@U1JTSR0AK>) - *Volunteer Leader*\nKaleb Wasmuth (<@U1JT6HNE5>) - *Volunteer Leader*\nDave Diaz (<@U1JUW26US>) - *Volunteer Leader*\nSpencer Steiner (<@U1EH7HNF6>) - *Website Developer*\nJacob Gates (<@U1T9NN6LX>) - *Quality Assurance*\nLuca Kermas (<@U31GN6CE9>) - *Software Developer*\nAnthony Tagliaferri (<@U4317SEAK>) - *Build Coordinator*\nVraj Patel (<@U211PRWCC>) - *Video & Stream Leader*\nHenry Eason (<@U1SPW9BKJ>) - *Software Developer*\nStephanie Rodriguez (<@U23SRASER>) - *Social Media Coordinator*\nJose Ruiz (<@U3Q06UMCN>) - *Social Media Coordinator*\nTrevor Rodriguez (<@U20TRH9G8>) - *Customer Support*\n\n*If you have any questions, feel free to DM any of these people.*');
                }else{
                    enError();
                }
            }
            // --------------------
            
            // Multi-Admin Permissions
            else if(event.message === '$getDirectory'){
                if(getDirectoryEn){
                    updateLogs(event);
                    updateCounts();
                    
                    if(resultOfPermCheck !== 5){
                        // Sender is not a default user
                        
                        context.sendResponse('*Admins:*\n' + presentArray(getAdmins().sort()) + '\n\n*Moderators:*\n' + presentArray(getModerators().sort()) + '\n\n*Trainees:*\n' + presentArray(getTrainees().sort()) + '\n\n*Builders:*\n' + presentArray(getBuilders().sort()) + '\n\n*Artists:*\n' + presentArray(getArtists().sort()));
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 7) === '$search'){
                if(searchEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck !== 5){
                        if((event.message[7] === ' ' && event.message[8] === '"') && event.message[event.message.length - 1] === '"'){
                            var firstParse = parseCommand(event.message, 9, event.message.length, '');
                            var firstArg = firstParse[0];
                            var LNC = firstParse[1];
                            
                            if(event.message[LNC + 1] === ' ' && event.message[LNC + 2] === '"'){
                                var secondParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                var secondArg = secondParse[0];
                                
                                if(firstArg !== 'IP'){
                                    // firstArg is IP
                                    var returnedResultsOfSearch = searchField(firstArg, secondArg, resultOfPermCheck);
                                    
                                    if(returnedResultsOfSearch !== null){
                                        // firstArg is IP (we already knew this)
                                        
                                        if(returnedResultsOfSearch.length !== 0){
                                            context.sendResponse('Showing search results for *' + secondArg + '* in the field *' + firstArg + '*.\n\n' + returnedResultsOfSearch.join('\n\n'));
                                        }else{
                                            context.sendResponse('Showing search results for *' + secondArg + '* in the field *' + firstArg + '*.\n\n' + '>No Results');
                                        }
                                    }else{
                                        context.sendResponse(':warning: Error: Please specify a valid field (name, IGN, IP).');
                                    }
                                }else{
                                    // firstArg is something other than IP (could be invalid)
                                    var returnedResultsOfSearch = searchField(firstArg, secondArg, resultOfPermCheck);
                                    if(returnedResultsOfSearch !== null){
                                        // firstArg is name or IGN
                                        if(returnedResultsOfSearch.length !== 0){
                                            context.sendResponse('Showing search results for *' + secondArg + '* in the field *' + firstArg + '*.\n\n' + returnedResultsOfSearch.join('\n\n'));
                                        }else{
                                            context.sendResponse('Showing search results for *' + secondArg + '* in the field *' + firstArg + '*.\n\n' + '>No Results');
                                        }
                                    }else{
                                        context.sendResponse(':warning: Error: Please specify a valid field (name, IGN, IP).');
                                    }
                                }
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$search "field" "value"`');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$search "field" "value"`');
                        }
                    }else{
                        permError(returnedResultsOfSearch);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 8) === '$addRole'){
                if(addRoleEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck !== 5){
                        if((event.message[8] === ' ' && event.message[9] === '"') && event.message[event.message.length - 1] === '"'){
                            var firstParse = parseCommand(event.message, 10, event.message.length, '');
                            var firstArg = firstParse[0];
                            var LNC = firstParse[1];
                            if(event.message[LNC + 1] === ' ' && event.message[LNC + 2] === '"'){
                                if(context.simpledb.botleveldata.members[firstArg] !== undefined){
                                    var secondParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                    var secondArg = secondParse[0];
                                    
                                    if(canEdit(resultOfPermCheck, firstArg)){
                                        if(((secondArg === 'Senior Moderator' || secondArg === 'Moderator') || (secondArg === 'Trainee' || secondArg === 'Builder')) || secondArg === 'Artist'){
                                            var targetObj = context.simpledb.botleveldata.members[firstArg];
                                            if(!((isInArray(secondArg, targetObj.backend.role))[0])){
                                                targetObj.backend.role.push(secondArg);
                                                context.sendResponse('Added the role *' + secondArg + '* to the profile *' + firstArg + '*.');
                                            }else{
                                                context.sendResponse(':warning: Error: That profile already has the role *' + secondArg + '*.');
                                            }
                                        }else{
                                            context.sendResponse(':warning: Error: Please use a valid role (Senior Moderator, Moderator, Trainee, Builder, Artist).');
                                        }
                                    }else{
                                        context.sendResponse(':warning: Error: You cannot edit the role of this profile.');
                                    }
                                }else{
                                    context.sendResponse(':warning: Error: The profile *' + firstArg + '* does not exist.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$addRole "username" "role"`');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$addRole "username" "role"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 8) === '$delRole'){
                if(delRoleEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck !== 5){
                        if((event.message[8] === ' ' && event.message[9] === '"') && event.message[event.message.length - 1] === '"'){
                            var firstParse = parseCommand(event.message, 10, event.message.length, '');
                            var firstArg = firstParse[0];
                            var LNC = firstParse[1];
                            if(event.message[LNC + 1] === ' ' && event.message[LNC + 2] === '"'){
                                var secondParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                var secondArg = secondParse[0];
                                if(context.simpledb.botleveldata.members[firstArg] !== undefined){
                                    if(canEdit(resultOfPermCheck, firstArg)){
                                        var targetObj = context.simpledb.botleveldata.members[firstArg];
                                        if((isInArray(secondArg, targetObj.backend.role))[0]){
                                            targetObj.backend.role.splice(targetObj.backend.role.indexOf(secondArg), 1);
                                            context.sendResponse('Removed role *' + secondArg + '* from the profile *' + firstArg + '*.');
                                        }else{
                                            context.sendResponse(':warning: Error: That profile does not have a role of *' + secondArg + '*.');
                                        }
                                    }else{
                                        context.sendResponse(':warning: Error: You cannot edit the role of this profile.');
                                    }
                                }else{
                                    context.sendResponse(':warning: Error: The profile *' + firstArg + '* does not exist.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$delRole "username" "role"`');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$delRole "username" "role"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            
            else if(event.message.substring(0, 10) === '$addMember'){
                if(addMemberEn){
                    updateLogs(event);
                    updateCounts();
                    
                    if(resultOfPermCheck < 5){
                        if((event.message[10] === ' ' && event.message[11] === '"') && event.message[event.message.length - 1] === '"'){
                            var firstParse = parseCommand(event.message, 12, event.message.length, '');
                            var firstArg = firstParse[0];
                            
                            if(!((isInArray(firstArg, context.simpledb.botleveldata.allProfilesList))[0])){
                                // Profile does not exist, which is good
                                if(getPermNode(firstArg) !== 5){
                                    // Person to be added is not a default user
                                    // Constructor Format: (name, IGN, IP, adder, dateAdded, lastUpdated, allNotes, publicNotes, noteNumber, role, username)
                                    
                                    // Remove user from deleted profs if necessary
                                    if(context.simpledb.botleveldata.deletedProfs[firstArg] !== undefined){
                                        delete context.simpledb.botleveldata.deletedProfs[firstArg];
                                    }
                                    
                                    // Add name of profile to profile list
                                    var profList = context.simpledb.botleveldata.allProfilesList;
                                    profList.push(firstArg);
                                    context.simpledb.botleveldata.allProfilesList = profList;
                                    
                                    // Make profile
                                    var newProfile = new Member('Unknown', 'Unknown', 'Unknown', event.senderobj.display, getDate(new Date()), getDate(new Date()), {}, {}, 1, ['Admin'], firstArg);
                                    
                                    // Add profile
                                    context.simpledb.botleveldata.members[firstArg] = newProfile;
                                    
                                    context.sendResponse('Created the profile *' + firstArg + '*.');
                                }else{
                                    context.sendResponse(':warning: Error: *' + firstArg + '* is a *' + getLetterNode(firstArg) + '*. Please use `$addModerator`, `$addTrainee`, `$addBuilder`, or `$addArtist` to add this profile.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: The profile *' + firstArg + '* already exists.');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$addMember "username"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 13) === '$addModerator'){
                if(addModeratorEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck === 0 || resultOfPermCheck === 1){
                        if((event.message[13] === ' ' && event.message[14] === '"') && event.message[event.message.length - 1] === '"'){
                            // Command is valid and sender is allowed
                            var firstParse = parseCommand(event.message, 15, event.message.length, '');
                            var firstArg = firstParse[0];
                            
                            if(!((isInArray(firstArg, context.simpledb.botleveldata.allProfilesList))[0])){
                                // Profile does not exist, which is good
                                if(getPermNode(firstArg) === 5 || getPermNode(firstArg) === 4){
                                    // Target is a default user
                                    // Constructor Format: (name, IGN, IP, adder, dateAdded, lastUpdated, allNotes, publicNotes, noteNumber, role, username)
                                    
                                    // Remove user from deleted profs if necessary
                                    if(context.simpledb.botleveldata.deletedProfs[firstArg] !== undefined){
                                        delete context.simpledb.botleveldata.deletedProfs[firstArg];
                                    }
                                    
                                    // Add name of profile to profile list
                                    var profList = context.simpledb.botleveldata.allProfilesList;
                                    profList.push(firstArg);
                                    context.simpledb.botleveldata.allProfilesList = profList;
                                    
                                    // Add profile
                                    var newProfile = new Member('Unknown', 'Unknown', 'Unknown', event.senderobj.display, getDate(new Date()), getDate(new Date()), {}, {}, 1, ['Moderator'], firstArg);
                                    context.simpledb.botleveldata.members[firstArg] = newProfile;
                                    
                                    context.sendResponse('Created the profile *' + firstArg + '*.');
                                    
                                }else{
                                    context.sendResponse(':warning: Error: *' + firstArg + '* is a *' + getLetterNode(getPermNode(firstArg)) + '*. Please use `$addMember` to add this profile.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: The profile *' + firstArg + '* already exists.');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$addModerator "username"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 11) === '$addTrainee'){
                if(addTraineeEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck === 0 || resultOfPermCheck === 1){
                        if((event.message[11] === ' ' && event.message[12] === '"') && event.message[event.message.length - 1] === '"'){
                            // Command is valid and sender is allowed
                            var firstParse = parseCommand(event.message, 13, event.message.length, '');
                            var firstArg = firstParse[0];
                            
                            if(!((isInArray(firstArg, context.simpledb.botleveldata.allProfilesList))[0])){
                                // Profile does not exist, which is good
                                if(getPermNode(firstArg) === 5){
                                    // Target is a default user
                                    // Constructor Format: (name, IGN, IP, adder, dateAdded, lastUpdated, allNotes, publicNotes, noteNumber, role, username)
                                    
                                    // Remove user from deleted profs if necessary
                                    if(context.simpledb.botleveldata.deletedProfs[firstArg] !== undefined){
                                        delete context.simpledb.botleveldata.deletedProfs[firstArg];
                                    }
                                    
                                    // Add name of profile to profile list
                                    var profList = context.simpledb.botleveldata.allProfilesList;
                                    profList.push(firstArg);
                                    context.simpledb.botleveldata.allProfilesList = profList;
                                    
                                    // Add profile
                                    var newProfile = new Member('Unknown', 'Unknown', 'Unknown', event.senderobj.display, getDate(new Date()), getDate(new Date()), {}, {}, 1, ['Trainee'], firstArg);
                                    context.simpledb.botleveldata.members[firstArg] = newProfile;
                                    
                                    context.sendResponse('Created the profile *' + firstArg + '*.');
                                    
                                }else{
                                    context.sendResponse(':warning: Error: *' + firstArg + '* is a *' + getLetterNode(getPermNode(firstArg)) + '*. Please use `$addMember` to add this profile.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: The profile *' + firstArg + '* already exists.');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$addTrainee "username"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 11) === '$addBuilder'){
                if(addBuilderEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck === 0 || resultOfPermCheck === 2){
                        if((event.message[11] === ' ' && event.message[12] === '"') && event.message[event.message.length - 1] === '"'){
                            // Command is valid and sender is allowed
                            var firstParse = parseCommand(event.message, 13, event.message.length, '');
                            var firstArg = firstParse[0];
                            
                            if(!((isInArray(firstArg, context.simpledb.botleveldata.allProfilesList))[0])){
                                // Profile does not exist, which is good
                                if(getPermNode(firstArg) === 5){
                                    // Target is a default user
                                    // Constructor Format: (name, IGN, IP, adder, dateAdded, lastUpdated, allNotes, publicNotes, noteNumber, role, username)
                                    
                                    // Remove user from deleted profs if necessary
                                    if(context.simpledb.botleveldata.deletedProfs[firstArg] !== undefined){
                                        delete context.simpledb.botleveldata.deletedProfs[firstArg];
                                    }
                                    
                                    // Add name of profile to profile list
                                    var profList = context.simpledb.botleveldata.allProfilesList;
                                    profList.push(firstArg);
                                    context.simpledb.botleveldata.allProfilesList = profList;
                                    
                                    // Add profile
                                    var newProfile = new Member('Unknown', 'Unknown', 'Unknown', event.senderobj.display, getDate(new Date()), getDate(new Date()), {}, {}, 1, ['Builder'], firstArg);
                                    context.simpledb.botleveldata.members[firstArg] = newProfile;
                                    
                                    context.sendResponse('Created the profile *' + firstArg + '*.');
                                    
                                }else{
                                    context.sendResponse(':warning: Error: *' + firstArg + '* is a *' + getLetterNode(getPermNode(firstArg)) + '*. Please use `$addMember` to add this profile.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: The profile *' + firstArg + '* already exists.');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$addBuilder "username"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 10) === '$addArtist'){
                if(addArtistEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck === 0 || resultOfPermCheck === 3){
                        if((event.message[10] === ' ' && event.message[11] === '"') && event.message[event.message.length - 1] === '"'){
                            // Command is valid and sender is allowed
                            var firstParse = parseCommand(event.message, 12, event.message.length, '');
                            var firstArg = firstParse[0];
                            
                            if(!((isInArray(firstArg, context.simpledb.botleveldata.allProfilesList))[0])){
                                // Profile does not exist, which is good
                                if(getPermNode(firstArg) === 5){
                                    // Target is a default user
                                    // Constructor Format: (name, IGN, IP, adder, dateAdded, lastUpdated, allNotes, publicNotes, noteNumber, role, username)
                                    
                                    // Remove user from deleted profs if necessary
                                    if(context.simpledb.botleveldata.deletedProfs[firstArg] !== undefined){
                                        delete context.simpledb.botleveldata.deletedProfs[firstArg];
                                    }
                                    
                                    // Add name of profile to profile list
                                    var profList = context.simpledb.botleveldata.allProfilesList;
                                    profList.push(firstArg);
                                    context.simpledb.botleveldata.allProfilesList = profList;
                                    
                                    // Add profile
                                    var newProfile = new Member('Unknown', 'Unknown', 'Unknown', event.senderobj.display, getDate(new Date()), getDate(new Date()), {}, {}, 1, ['Artist'], firstArg);
                                    context.simpledb.botleveldata.members[firstArg] = newProfile;
                                    
                                    context.sendResponse('Created the profile *' + firstArg + '*.');
                                    
                                }else{
                                    context.sendResponse(':warning: Error: *' + firstArg + '* is a *' + getLetterNode(getPermNode(firstArg)) + '*. Please use `$addMember` to add this profile.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: The profile *' + firstArg + '* already exists.');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$addArtist "username"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 11) === '$editMember'){
                if(editMemberEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck !== 5){
                        if((event.message[11] === ' ' && event.message[12] === '"') && event.message[event.message.length - 1] === '"'){
                            var firstParse = parseCommand(event.message, 13, event.message.length, '');
                            var firstArg = firstParse[0];
                            var LNC = firstParse[1];
                            
                            if(event.message[LNC + 1] === ' ' && event.message[LNC + 2] === '"'){
                                var secondParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                var secondArg = secondParse[0];
                                LNC = secondParse[1];3
                                
                                if(event.message[LNC + 1] === ' ' && event.message[LNC + 2] === '"'){
                                    var thirdParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                    var thirdArg = thirdParse[0];
                                    LNC = thirdParse[1];
                                    // Syntax is correct
                                    
                                    if(context.simpledb.botleveldata.members[firstArg] !== undefined){
                                        // Profile exists
                                        
                                        if(canEdit(getPermNode(event.senderobj.subdisplay), firstArg)){
                                            // Sender/Target match is valid
                                            if((secondArg === 'name' || secondArg === 'IGN') || secondArg === 'IP'){
                                                // Subcommand is valid
                                                var targetObj = context.simpledb.botleveldata.members[firstArg];
                                                if(secondArg === 'name'){
                                                    targetObj.public.name = thirdArg;
                                                }
                                                if(secondArg === 'IGN'){
                                                    targetObj.public.IGN = thirdArg;
                                                }
                                                if(secondArg === 'IP'){
                                                    targetObj.private.IP = thirdArg;
                                                }
                                                
                                                context.sendResponse('Changed *' + firstArg + '\'s* ' + secondArg + ' to *' + thirdArg + '*.');
                                            }else{
                                                context.sendResponse(':warning: Error: Please specify a valid field (name, IGN, IP).');
                                            }
                                        }else{
                                            context.sendResponse(':warning: Error: You cannot edit this profile with a permission node of *' + getLetterNode(resultOfPermCheck) + '*.');
                                        }
                                    }else{
                                        context.sendResponse(':warning: Error: The profile *' + firstArg + '* does not exist.');
                                    }
                                }else{
                                    context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$editMember "username" "field" "value"`');
                                }
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$editMember "username" "field" "value"`');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$editMember "username" "field" "value"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 10) === '$delMember'){
                if(delMemberEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck === 0){
                        if((event.message[10] = ' ' && event.message[11] === '"') && event.message[event.message.length - 1] === '"'){
                            // Correct perms and syntax is our friend :D
                            
                            var firstParse = parseCommand(event.message, 12, event.message.length, '');
                            var firstArg = firstParse[0];
                            
                            if(isInArray(firstArg, context.simpledb.botleveldata.allProfilesList)){
                                // User exists
                                
                                // Delete from user list
                                context.simpledb.botleveldata.allProfilesList.splice(context.simpledb.botleveldata.allProfilesList.indexOf(firstArg), 1);
                                
                                var userToDel = context.simpledb.botleveldata.members[firstArg];
                                
                                //Delete profile
                                delete context.simpledb.botleveldata.members[firstArg];
                                
                                if(keepDeletedProfiles){
                                    // Put user in deleted profile area
                                    context.simpledb.botleveldata.deletedProfs[firstArg] = userToDel;
                                }
                                
                                context.sendResponse('Deleted the profile *' + firstArg + '*.');
                            }else{
                                context.sendResponse(':warning: Error: The profile *' + firstArg + '* does not exist.');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$delMember "username"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 11) === '$viewMember'){
                if(viewMemberEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck !== 5){
                        if((event.message[11] === ' ' && event.message[12] === '"') && event.message[event.message.length - 1] === '"'){
                            var firstParse = parseCommand(event.message, 13, event.message.length, '');
                            var firstArg = firstParse[0];
                            if(context.simpledb.botleveldata.members[firstArg] !== undefined){
                                var targetObj = context.simpledb.botleveldata.members[firstArg];
                                if(canEdit(resultOfPermCheck, firstArg)){
                                    
                                    //Show private stuff
                                    var makeListVar = [];
                                    for(var i in targetObj.private.allNotes){
                                        var currentNote = targetObj.private.allNotes[i];
                                        if(currentNote.isHidden){
                                            makeListVar.push('`P`   *[N-' + currentNote.ID + ']* ' + currentNote.sender + ' at ' + currentNote.dateSent + ': ' + currentNote.text);
                                        }else{
                                            makeListVar.push('*[N-' + currentNote.ID + ']* ' + currentNote.sender + ' at ' + currentNote.dateSent + ': ' + currentNote.text);
                                        }
                                    }
                                    var commentString = '>';
                                    commentString = commentString + makeListVar.join('\n\n>');
                                    
                                    context.sendResponse('*Showing ' + firstArg + ':*\n\n>*Name:* ' + targetObj.public.name + '\n\n>*IGN:* ' + targetObj.public.IGN + '\n\n>*IP:* ' + targetObj.private.IP + '\n\n>*Role(s):* ' + targetObj.backend.role.join(', ') + '\n\n*---*\n\n*Notes:*\n\n' + commentString + '\n\n_Added by ' + targetObj.public.adder + ' on ' + targetObj.public.dateAdded + '._');
                                    
                                }else{
                                    
                                    // Don't show private stuff
                                    var makeListVar = [];
                                    for(var i in targetObj.private.allNotes){
                                        var currentNote = targetObj.private.allNotes[i];
                                        if(currentNote.isHidden){
                                            
                                        }else{
                                            makeListVar.push('*[N-' + currentNote.ID + ']* ' + currentNote.sender + ' at ' + currentNote.dateSent + ': ' + currentNote.text);
                                        }
                                    }
                                    var commentString = '>';
                                    commentString = commentString + makeListVar.join('\n\n>');
                                    
                                    if(targetObj.private.IP !== 'Unknown'){
                                        var newIPString = '';
                                        for(var x = 0; x < targetObj.private.IP.length; x++){
                                            if(targetObj.private.IP[x] === '.'){
                                                newIPString = newIPString + targetObj.private.IP[x];
                                            }else{
                                                newIPString = newIPString + '*';
                                            }
                                        }
                                    }
                                    
                                    context.sendResponse('*Showing ' + firstArg + ':*\n\n>*Name:* ' + targetObj.public.name + '\n\n>*IGN:* ' + targetObj.public.IGN + '\n\n>*IP:* ' + newIPString + '\n\n>*Role(s):* ' + targetObj.backend.role.join(', ') + '\n\n*---*\n\n*Notes:*\n\n' + commentString + '\n\n_Added by ' + targetObj.public.adder + ' on ' + targetObj.public.dateAdded + '._');
                                }
                            }else{
                                context.sendResponse(':warning: Error: The profile *' + firstArg + '* does not exist.');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$viewMember "username"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 8) === '$addNote'){
                if(addNoteEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck !== 5){
                        if((event.message[8] === ' ' && event.message[9] === '"') && (event.message[event.message.length - 1] === '"' || event.message.substring(event.message.length - 2, event.message.length) === '-h')){
                            var firstParse = parseCommand(event.message, 10, event.message.length, '');
                            var firstArg = firstParse[0];
                            var LNC = firstParse[1];
                            
                            if(event.message[LNC + 1] === ' ' && event.message[LNC + 2] === '"'){
                                var secondParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                var secondArg = secondParse[0];
                                
                                if(context.simpledb.botleveldata.members[firstArg] !== undefined){
                                    if(canEdit(resultOfPermCheck, firstArg)){
                                        var shouldBeHidden = false;
                                        if(event.message.substring(event.message.length - 2, event.message.length) === '-h'){
                                            shouldBeHidden = true;
                                        }
                                        
                                        var targetObj = context.simpledb.botleveldata.members[firstArg];
                                        
                                        // text, sender, dateSent, isHidden, ID
                                        var newNote = new Note(secondArg, event.senderobj.display, getFullDate(new Date()), shouldBeHidden, targetObj.backend.noteNumber);
                                        
                                        targetObj.private.allNotes['N-' + targetObj.backend.noteNumber] = newNote;
                                        
                                        if(!shouldBeHidden){
                                            targetObj.public.publicNotes['N-' + targetObj.backend.noteNumber] = newNote;
                                        }
                                        
                                        targetObj.backend.noteNumber++;
                                        
                                        context.sendResponse('Created a note on the profile *' + firstArg + '*.');
                                    }else{
                                        context.sendResponse(':warning: Error: You cannot edit this profile with a permission node of *' + getLetterNode(resultOfPermCheck) + '*.');
                                    }
                                }else{
                                    context.sendResponse(':warning: Error: The profile *' + firstArg + '* does not exist.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$addNote "username" "text"`');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$addNote "username" "text"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 8) === '$delNote'){
                if(delNoteEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck !== 5){
                        if((event.message[8] === ' ' && event.message[9] === '"') && event.message[event.message.length - 1] === '"'){
                            var firstParse = parseCommand(event.message, 10, event.message.length, '');
                            var firstArg = firstParse[0];
                            var LNC = firstParse[1];
                            
                            if(event.message[LNC + 1] === ' ' && event.message[LNC + 2] === '"'){
                                var secondParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                var secondArg = secondParse[0];
                                
                                if(context.simpledb.botleveldata.members[firstArg] !== undefined){
                                    if(canEdit(resultOfPermCheck, firstArg)){
                                        var targetObj = context.simpledb.botleveldata.members[firstArg];
                                        
                                        if(targetObj.private.allNotes['N-' + secondArg] !== undefined){
                                            
                                            delete targetObj.private.allNotes['N-' + secondArg];
                                            
                                            if(targetObj.public.publicNotes[secondArg] !== undefined){
                                                delete targetObj.public.publicNotes[ 'N-' + secondArg];
                                            }
                                            
                                            context.sendResponse('Deleted the note from the profile *' + firstArg + '*.');
                                        }else{
                                            context.sendResponse(':warning: Error: The note doesn\'t exist.');
                                        }
                                    }else{
                                        context.sendResponse(':warning: Error: You cannot edit this profile with a permission node of *' + getLetterNode(resultOfPermCheck) + '*.');
                                    }
                                }else{
                                    context.sendResponse(':warning: Error: The profile *' + firstArg + '* does not exist.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$delNote "username" "note-id"`');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$delNote "username" "note-id"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 9) === '$editNote'){
                if(editNoteEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck !== 5){
                        if((event.message[9] === ' ' && event.message[10] === '"') && event.message[event.message.length - 1] === '"'){
                            var firstParse = parseCommand(event.message, 11, event.message.length, '');
                            var firstArg = firstParse[0];
                            var LNC = firstParse[1];
                            
                            if(event.message[LNC + 1] === ' ' && event.message[LNC + 2] === '"'){
                                var secondParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                var secondArg = secondParse[0];
                                var LNC = secondParse[1];
                                
                                if(event.message[LNC + 1] === ' ' && event.message[LNC + 2] === '"'){
                                    var thirdParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                    var thirdArg = thirdParse[0];
                                    
                                    if(context.simpledb.botleveldata.members[firstArg] !== undefined){
                                        var targetObj = context.simpledb.botleveldata.members[firstArg];
                                        if(targetObj.private.allNotes['N-' + secondArg] !== undefined){
                                            var privateNote = targetObj.private.allNotes['N-' + secondArg];
                                            if(privateNote.sender === event.senderobj.display){
                                                
                                                privateNote.text = thirdArg;
                                                if(targetObj.public.publicNotes['N-' + secondArg] !== undefined){
                                                    var publicNote = targetObj.public.publicNotes['N-' + secondArg];
                                                    
                                                    publicNote.text = thirdArg;
                                                }
                                                
                                                context.sendResponse('Edited note *N-' + secondArg + '*.');
                                            }else{
                                                context.sendResponse(':warning: Error: You cannot edit this note.');
                                            }
                                        }else{
                                            context.sendResponse(':warning: Error: The note doesn\'t exist.');
                                        }
                                    }else{
                                        context.sendResponse(':warning: Error: The profile *' + firstArg + '* does not exist.');
                                    }
                                }else{
                                    context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$editNote "username" "note-id" "text"`');
                                }
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$editNote "username" "note-id" "text"`');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$editNote "username" "note-id" "text"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            
            // Global Admin Permissions
            else if(event.message.substring(0, 8) === '$setPerm'){
                if(setPermEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck === 0){
                        if(event.message[8] === ' ' && event.message[9] === '"'){
                            // Parse First Value
                            var firstParse = parseCommand(event.message, 10, event.message.length, '');
                            var firstArg = firstParse[0];
                            var LNC = firstParse[1];
                            
                            if(event.message[LNC + 2] === '"' && event.message[event.message.length - 1] === '"'){
                                // Parse Second Value
                                var secondParse = parseCommand(event.message, LNC + 3, event.message.length, '');
                                var secondArg = secondParse[0];
                                
                                // Old Permissions
                                var oldNode = getPermNode(firstArg);
                                var oldLetterNode = getLetterNode(getPermNode(firstArg));
                                // Check that is number 0-5
                                if(!(isNaN(parseInt(secondArg))) && (parseInt(secondArg) < 6 && parseInt(secondArg) > -1)){
                                    // Check that current permission is not Global Admin
                                    if(oldNode <= 5 && oldNode >= 1){
                                        // Check that not trying to change to global admin or default user
                                        if(!((parseInt(secondArg) === 5) || (parseInt(secondArg) === 0))){
                                            // Second Argument is a valid choice
                                            
                                            var oldNodeList = getAllNodes(firstArg);
                                            if(!(oldNodeList.length > 1)){
                                                var oldLitPerm = getLiteralPerm(oldNode);
                                                var newLitPerm = getLiteralPerm(parseInt(secondArg));
                                                
                                                if(oldNode !== 5){
                                                    // Remove Old Perm
                                                    var oldPermList = context.simpledb.botleveldata[oldLitPerm];
                                                    var index = oldPermList.indexOf(firstArg);
                                                    oldPermList.splice(index, 1);
                                                    context.simpledb.botleveldata[oldLitPerm] = oldPermList;
                                                }
                                                
                                                var newPermList = context.simpledb.botleveldata[newLitPerm];
                                                newPermList.push(firstArg);
                                                context.simpledb.botleveldata[newLitPerm] = newPermList;
                                                context.sendResponse('Changed *' + firstArg + '\'s* permission node from *' + oldNode + ' (' + oldLetterNode + ')* to *' + secondArg + ' (' + getLetterNode(parseInt(secondArg)) + ')*.');
                                            }else{
                                                
                                            }
                                        }else{
                                            context.sendResponse(':warning: Error: Cannot change a user\'s permission node to ' + getLetterNode(parseInt(secondArg)));
                                        }
                                    }else{
                                        context.sendResponse(':warning: Error: Cannot change permission node of *' + firstArg + '* because he/she is a *' + oldLetterNode + '*.');
                                    }
                                }else{
                                    context.sendResponse(':warning: Error: Please select a valid second value (0-5).');
                                }
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$setPerm "username" "permissionNode"`');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$setPerm "username" "permissionNode"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            else if(event.message.substring(0, 8) === '$delPerm'){
                if(delPermEn){
                    updateLogs(event);
                    updateCounts(resultOfPermCheck);
                    
                    if(resultOfPermCheck === 0){
                        if(event.message[8] === ' ' && event.message[9] === '"'){
                            // Get first (only) arg
                            var firstParse = parseCommand(event.message, 10, event.message.length, '');
                            var firstArg = firstParse[0];
                            
                            if(event.message[event.message.length - 1] === '"'){
                                var oldPerm = getPermNode(firstArg);
                                if((oldPerm !== 0) && (oldPerm !== 5)){
                                    // Can delete perm - yay!
                                    
                                    var oldPermToDel = context.simpledb.botleveldata[getLiteralPerm(oldPerm)];
                                    oldPermToDel.splice(oldPermToDel.indexOf(firstArg), 1);
                                    context.simpledb.botleveldata[getLiteralPerm(oldPerm)] = oldPermToDel;
                                    context.sendResponse('Deleted *' + firstArg + '\'s* permission node *(' + getLetterNode(oldPerm) + ')*.');
                                }else{
                                    context.sendResponse(':warning: Error: Cannot delete permission node of *' + firstArg + '* because he/she is a *' + getLetterNode(oldPerm) + '*.');
                                }
                            }else{
                                context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$delPerm "username"`');
                            }
                        }else{
                            context.sendResponse(':warning: Error: Can\'t parse command. Correct syntax:\n`$delPerm "username"`');
                        }
                    }else{
                        permError(resultOfPermCheck);
                    }
                }else{
                    enError();
                }
            }
            // --------------------
            
            // Testing Commands - Dangerous
            // These commands do not have enabled/disabled conditionals.
            // These commands do not count towards command usage counts.
            // These commands do not count towards logs.
            // These commands are only available to Kaleb.
            
            else if(event.message === '$resetCounts'){
                if(event.senderobj.subdisplay === 'kaleb418'){
                    context.simpledb.botleveldata.timesused = 0;
                    context.simpledb.botleveldata.timestraineeused = 0;
                    context.simpledb.botleveldata.timesmodused = 0;
                    context.simpledb.botleveldata.timesartistadminused = 0;
                    context.simpledb.botleveldata.timesbuilderadminused = 0;
                    context.simpledb.botleveldata.timesmodadminused = 0;
                    context.simpledb.botleveldata.timesadminused = 0;
                    context.sendResponse('Reset all command usage counts.');
                }else{
                    permError();
                }
            }
            // --------------------
            else if(event.message === '$resetLogs'){
                if(event.senderobj.subdisplay === 'kaleb418'){
                    updateLogs(event);
                    context.simpledb.botleveldata.logs.length = 1;
                    context.sendResponse('Reset command logs.');
                }else{
                    permError();
                }
            }
            // --------------------
            else if(event.message === '$refresh'){
                if(event.senderobj.subdisplay === 'kaleb418'){
                    // Add stuffs to be updated
                    context.sendResponse('Refreshed and updated database.');
                }else{
                    permError();
                }
            }
        }else{
            if(event.message === '<@' + event.senderobj.channelid + '|' + event.senderobj.subdisplay + '> has joined the group'){
                context.sendResponse('Welcome, ' + event.senderobj.display + '! If you\'re new here, please wait for someone to talk to you. Else, enjoy your stay in this new channel!');
            }
        }
    }
}

function EventHandler(context, event) {
    
}

function HttpResponseHandler(context, event) {
    
}

function DbGetHandler(context, event) {
    
}

function DbPutHandler(context, event) {
    
}