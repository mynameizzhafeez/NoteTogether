const Review = require("../model/Review");
const User = require("../../user/model/User");
const Note = require("../../note/model/Note");

const PER_PAGE = 5;

exports.createReview = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    const noteId = req.body.noteId;

    // Create Review (assume first that its not a fork)
    var review = new Review({
      title: req.body.title,
      content: req.body.content,
      userId: userId,
      noteId: noteId
    });

    // Adds new Review to user's collection
    let savedReview = await review.save();
    let note = await Note.findById(noteId);
    note.reviews = [review._id, ...note.reviews];
    await note.save();

    res.status(200).json({ review: savedReview });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

exports.readReview = async (req, res) => {
  try {
    // Review to be read
    const reviewId = req.body.reviewId;
    let review = await Review.findById(reviewId);

    // Id of the requestor
    const userId = review.userId;

    // Id of the creator of the Review
    let author = await User.findById(review.userId);

    res.status(200).json({
      title: review.title,
      content: review.content,
      author: author.username
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

exports.updateReview = async (req, res) => {
  try {
    // Review to be updated
    const reviewId = req.body.reviewId;
    let review = await Review.findById(reviewId);

    // Id of the requestor
    const userId = req.userData._id;
    // Id of the Review creator
    const authorId = review.userId;

    // Cannot update a Review that does not belong to you
    if (authorId != userId) {
      return res.status(401).json({ err: "Not authorised!" });
    }

    // Cannot update a deleted review
    if (review.isDeleted) {
      return res.status(405).json({
        review: review,
        err: "Cannot update a deleted review!"
      });
    }

    // Replaces the content
    review.content = req.body.content;
    review.title = req.body.title;
    review.dateLastUpdated = Date.now();
    await review.save();

    res.status(200).json({ Review: review });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

exports.deleteReview = async (req, res) => {
  try {
    // Review to be deleted
    const reviewId = req.body.reviewId;
    let review = await Review.findById(reviewId);

    // Cannot update a Review that does not belong to you
    if (review.userId != req.userData._id) {
      return res.status(401).json({ err: "Not authorised!" });
    }

    // Cannot delete a deleted Review
    if (review.isDeleted) {
      return res.status(405).json({
        Review: review,
        err: "Review has already been deleted!"
      });
    }

    // Updates the flags for the Review
    review.isDeleted = true;
    const savedReview = await review.save();

    // Delete Review from the note's perspective
    let note = await User.findById(review.noteId);
    note.reviews.splice(note.reviews.indexOf(reviewId), 1);
    await note.save();

    res.status(200).json({ Review: savedReview });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}