// TODO BOARD
// - enforce cannot fork unpublished notes
// - should not store unchanged diffs

const Note = require("../model/Note");
const User = require("../../user/model/User");

const PER_PAGE = 5;

exports.createNote = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    
    // Checks whether note of the same title has been created by the user
    const noteSearch = await Note.find({
      title: req.body.title,
      userId: userId,
      isDeleted: false
    });

    // User is not allowed to create two notes of the same name
    if (noteSearch.length >= 1) {
      return res.status(409).json({
        note: noteSearch[0],
        err: "You have already created a note with this name!"
      });
    }

    // Create note (assume first that its not a fork)
    var note = new Note({
      title: req.body.title,
      content: req.body.content.split('\n').map(x => "+" + x),
      userId: userId
    });

    if (!!req.body.forkOf) {

      // Find parent note
      let noteParent = await Note.findById(req.body.forkOf);
      if (!noteParent) {
        return res.status(409).json({
          userId: userId,
          err: "Can't fork, no such parent note exists!"
        });        
      }

      let noteParentContent = await resolveFork(req.body.forkOf);

      console.log("======================")
      console.log(typeof req.body.content.split('\n'))
      console.log(typeof noteParentContent)
      var out = diffArray(
        req.body.content.split('\n'),
        noteParentContent)
      console.log(out)
      console.log("======================")

      note = new Note({
        title: req.body.title,
        content: out, // change me!
        userId: userId,
        forkOf: req.body.forkOf
      });
    }

    // Adds new note to user's collection
    let savedNote = await note.save();
    let user = await User.findById(userId);
    user.notes = [note._id, ...user.notes];
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.readNote = async (req, res) => {
  try {
    // Note to be read
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = note.userId;

    // Id of the creator of the note
    const noteCreatorId = note.userId;
    let user = await User.findById(userId);
    const username = user.username;

    // Can access the note if you created it, or if it's published
    if (!note.isPublished && noteCreatorId != userId) {
      res.status(401).json({ err: "Not authorised" });
    }

    res.status(200).json({
      title: note.title,
      content: note.content,
      username: username
    });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.updateNote = async (req, res) => {
  try {
    // Note to be saved
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;
    // Id of the note creator
    const noteCreatorId = note.userId;

    // Cannot update a note that does not belong to you
    if (noteCreatorId != userId) {
      return res.status(401).json({ err: "Not authorised!" });
    }
    
    // Cannot update a published or deleted note
    if (note.isPublished || note.isDeleted) {
      return res.status(405).json({
        note: note,
        err: "Cannot update a published or deleted note!"
      });
    }

    // Replaces the content
    note.content = req.body.content;
    note.dateLastUpdated = Date.now();
    await note.save();

    res.status(200).json({ note: note });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.deleteNote = async (req, res) => {
  try {
    // Note to be deleted
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Cannot delete a deleted note
    if (note.isDeleted) {
      return res.status(405).json({
        note: note,
        err: "Note has already been deleted!"
      });
    }

    // Updates the flags for the note
    note.isDeleted = true;
    note.isPublished = false;
    const savedNote = await note.save();

    // Delete note from the user's perspective
    const userId = req.userData._id;
    let user = await User.findById(userId);
    user.notes.splice(user.notes.indexOf(noteId), 1);
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.publishNote = async (req, res) => {
  try {
    // Note to be published
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);
    // Id of the note creator
    const noteCreatorId = note.userId;

    // Cannot publish note that does not belong to you
    if (noteCreatorId != userId) {
      return res.status(401).json({ err: "Not authorised!" });
    }

    // Cannot published note that has already been published
    if (note.isPublished) {
      return res.status(405).json({
        note: note,
        err: "Note already published"
      });
    }

    // Updates note entries
    note.isPublished = true;
    note.datePublished = Date.now();
    await note.save();

    // Create new private note that can still be edited
    const newPrivateNote = new Note({
      title: note.title,
      userId: noteCreatorId,
      content: note.content,
    });

    // Adds new note to user's collection
    const savedNote = await newPrivateNote.save();
    user.notes = [newPrivateNote._id, ...user.notes];
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.searchNote = async (req, res) => {
  try {
    const notes = await Note
      .find({
        title: { $regex: new RegExp(req.body.searchTerm, "i") },
        isPublished: true,
        isDeleted: false
      })
      .sort({ datePublished: -1 })
      .skip(PER_PAGE*(req.body.page-1))
      .limit(PER_PAGE)
      .populate("userId", "username")
      .select("title userId datePublished username");

    res.status(200).json({ searchResults: notes });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

function myers( o, n ) {
  var ns = new Object();
  var os = new Object();
  
  for ( var i = 0; i < n.length; i++ ) {
    if ( ns[ n[i] ] == null )
      ns[ n[i] ] = { rows: new Array(), o: null };
    ns[ n[i] ].rows.push( i );
  }
  
  for ( var i = 0; i < o.length; i++ ) {
    if ( os[ o[i] ] == null )
      os[ o[i] ] = { rows: new Array(), n: null };
    os[ o[i] ].rows.push( i );
  }
  
  for ( var i in ns ) {
    if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
      n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
      o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
    }
  }
  
  for ( var i = 0; i < n.length - 1; i++ ) {
    if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && 
         n[i+1] == o[ n[i].row + 1 ] ) {
      n[i+1] = { text: n[i+1], row: n[i].row + 1 };
      o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
    }
  }
  
  for ( var i = n.length - 1; i > 0; i-- ) {
    if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && 
         n[i-1] == o[ n[i].row - 1 ] ) {
      n[i-1] = { text: n[i-1], row: n[i].row - 1 };
      o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
    }
  }
  
  return {o: o, n: n};
}

function diffArray(o, n) {

  var out = myers(o, n);
      
  var ret = [];
  var str = "";

  if (out.n.length == 0) {
      for (var i = 0; i < out.o.length; i++) {
        ret.push("-" + escape(out.o[i]))
      }
  } else {
    if (out.n[0].text == null) {
      for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
        ret.push("-" + escape(out.o[n]))
      }
    }

    for ( var i = 0; i < out.n.length; i++ ) {
      if (out.n[i].text == null) {
        ret.push("+" + escape(out.n[i]))
      } else {
        var pre = [];
        for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
          pre.push('-' + escape(out.o[n]))
        }
        ret.push(" " + out.n[i].text)
        ret.push(...pre)
      }
    }
  }
  
  return ret;
}

async function resolveFork(cur) {
  let note = await Note.findById(cur);

  console.log("WEEEEEEEEEEEEEEEEEEEE");
  console.log(note);
  console.log("WOOOOOOOOOOOOOOOOOOOO");

  if (!!note.forkOf) {
    console.log("SHUMP");
    return resolveFork(note.forkOf).push(...[note.content]);
  }

  console.log("SHOOP");
  console.log([note.content]);
  return [note.content];
}