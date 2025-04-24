import { useState, useRef, useEffect } from "react";
import { CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Reply, Trash2, ThumbsUp } from "lucide-react";
import { useToggle } from "../hooks/useToggle";
import { ConfirmDialog } from "../components/ConfirmationDialog";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";
import useDarkMode from "../hooks/DarkMode.jsx";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove,getDocs, collection,deleteDoc  } from "firebase/firestore";
import { auth } from "../../config/firebase";

export function ProposalCard({ proposal, role, isDarkMode }) {
  const user_collection = collection(db, "users");
  const [comment, setComment] = useState("");
  const [commentReply, setCommentReply] = useState({ parentIndex: null, text: "" });
  const { isOpen, openDialog, closeDialog, confirm } = useConfirmationDialog();
  const replyInputRef = useRef(null);
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({
    name: user?.name,
    dob: user?.dob,
    address: user?.address,
    ic_number: user?.ic_number,
    avatar_url: user?.avatar_url,
  });

  const handleVote = async () => {
    try {
      const proposalRef = doc(db, "proposals", proposal.id);
      if (proposal.votedUsers?.includes(auth.currentUser.uid)) {
        // User already voted - remove vote
        await updateDoc(proposalRef, {
          votes: proposal.votes - 1,
          votedUsers: arrayRemove(auth.currentUser.uid)
        });
      } else {
        // User hasn't voted - add vote
        await updateDoc(proposalRef, {
          votes: proposal.votes + 1,
          votedUsers: arrayUnion(auth.currentUser.uid)
        });
      }
    } catch (error) {
      console.error("Error updating vote: ", error);
    }
  };

  useEffect(() => {
    let ignore = false;
    const get_user = async() => {
      try{
        const user_data = await getDocs(user_collection);
        if(!ignore){
        const filteredData = user_data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        filteredData.forEach(user => {
          console.log("inside useeffect");
          if(user.id === auth.currentUser.uid){
            setUser(user);
            setProfile({
              name: user.name || '',
              dob: user.dob?.toDate() || null,
              address: user.address || '',
              ic_number: user.ic_number || '',
              avatar_url: user.avatar_url,
            });
          }
        });
      }
      }catch (err){
        console.log(err);
      }
    };
    get_user();
    return ()=> {ignore = true};
  },[]);

  const addComment = async () => {
    if (comment.trim() === "") return;
    
    const newComment = {
      userId: auth.currentUser.uid,
      userName: profile.name,
      userAvatar: profile.avatar_url,
      text: comment,
      timestamp: new Date().toISOString(),
      replies: []
    };

    try {
      const proposalRef = doc(db, "proposals", proposal.id);
      await updateDoc(proposalRef, {
        comments: arrayUnion(newComment)
      });
      setComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const deleteComment = async (commentToDelete) => {
    try {
      const proposalRef = doc(db, "proposals", proposal.id);
      await updateDoc(proposalRef, {
        comments: arrayRemove(commentToDelete)
      });
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const addReply = async (parentComment) => {
    if (commentReply.text.trim() === "") return;

    const newReply = {
      userId: auth.currentUser.uid,
      userName: profile.name,
      userAvatar: profile.avatar_url,
      text: commentReply.text.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const proposalRef = doc(db, "proposals", proposal.id);
      const updatedComments = proposal.comments.map(comment => {
        if (comment === parentComment) {
          return {
            ...comment,
            replies: [...comment.replies, newReply]
          };
        }
        return comment;
      });

      await updateDoc(proposalRef, {
        comments: updatedComments
      });
      setCommentReply({ parentIndex: null, text: "" });
    } catch (error) {
      console.error("Error adding reply: ", error);
    }
  };

  const handleKeyDownComment = (e) => {
    if (e.key === "Enter") {
      addComment();
    }
  };

  const handleKeyDownReply = (e) => {
    if (e.key === "Enter") {
      const parentComment = proposal.comments[commentReply.parentIndex];
      addReply(parentComment);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (replyInputRef.current && !replyInputRef.current.contains(event.target)) {
        setCommentReply({ parentIndex: null, text: "" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteProposal = async () => {
    try {
      const proposalRef = doc(db, "proposals", proposal.id);
      await deleteDoc(proposalRef);
      // You might want to add a success notification or redirect here
    } catch (error) {
      console.error("Error deleting proposal:", error);
      // Add error handling/notification here
    }
  };
  

  const hasVoted = proposal.votedUsers?.includes(auth.currentUser.uid);

  return (
    <div className="mb-5">
      <CardContent>
        <div className={`p-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}>
        <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
            {proposal.title}
          </h3>
          <p className={`mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {proposal.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {role === "Admin" && (
            <button
              onClick={() => openDialog(deleteProposal)}
              className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"} transition cursor-pointer`}
              title="Delete Proposal"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-700"}`}>
            {proposal.status || "pending"}
          </span>
        </div>
      </div>


          {proposal.file && (
            <div className="mb-3">
              <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>Attached File: </span>
              <a 
                href={proposal.file} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 underline cursor-pointer hover:text-blue-600"
              >
                {proposal.file.split("/").pop() || "View File"}
              </a>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <ThumbsUp 
                className={`w-5 h-5 mr-1 ${hasVoted ? "text-blue-500" : isDarkMode ? "text-gray-400" : "text-gray-600"}`} 
              />
              <span className={`text-lg font-bold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                {proposal.votes || 0} votes
              </span>
            </div>
            <Button 
              className={`flex items-center gap-2 px-4 py-2 rounded ${hasVoted 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-600 hover:bg-gray-500"} text-white`} 
              onClick={handleVote}
            >
              {hasVoted ? "Voted" : "Vote"}
            </Button>
          </div>

          <div className={`mt-6 p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md`}>
            <h4 className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              Discussion ({proposal.comments?.length || 0})
            </h4>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                className={`flex-1 p-2 border rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDownComment}
              />
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition" 
                onClick={addComment}
              >
                <Reply size={16} /> Comment
              </Button>
            </div>

            <div className="space-y-4">
              {proposal.comments?.map((comment, index) => (
                <div key={index} className={`p-3 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} rounded-lg shadow-sm`}>
                  <div className="flex items-start">
                    <img 
                      src={comment.userAvatar || "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"} 
                      alt={comment.userName} 
                      className="w-8 h-8 rounded-full mr-3" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                            {comment.userName}
                          </p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {new Date(comment.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {role === "Admin" && (
                          <button 
                            className="text-red-400 hover:text-red-500 transition cursor-pointer"
                            onClick={() => openDialog(() => deleteComment(comment))}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {comment.text}
                      </p>
                      
                      <button
                        className="mt-2 text-blue-500 hover:text-blue-600 text-xs flex items-center gap-1 transition cursor-pointer"
                        onClick={() => setCommentReply({ parentIndex: index, text: "" })}
                      >
                        <Reply size={14} /> Reply
                      </button>
                    </div>
                  </div>

                  {/* Reply Input */}
                  {commentReply.parentIndex === index && (
                    <div ref={replyInputRef} className="mt-3 pl-11">
                      <input
                        type="text"
                        value={commentReply.text}
                        onChange={(e) => setCommentReply({ ...commentReply, text: e.target.value })}
                        className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Write a reply..."
                        onKeyDown={handleKeyDownReply}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setCommentReply({ parentIndex: null, text: "" })}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => addReply(comment)}
                          disabled={!commentReply.text.trim()}
                        >
                          Post Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className={`mt-3 space-y-3 pl-11 border-l-2 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                      {comment.replies.map((reply, replyIndex) => (
                        <div key={replyIndex} className="pt-3">
                          <div className="flex items-start">
                            <img 
                              src={reply.userAvatar || "/default-avatar.png"} 
                              alt={reply.userName} 
                              className="w-6 h-6 rounded-full mr-2" 
                            />
                            <div>
                              <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                                {reply.userName}
                              </p>
                              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {new Date(reply.timestamp).toLocaleString()}
                              </p>
                              <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {reply.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ConfirmDialog
          open={isOpen}
          onClose={closeDialog}
          onConfirm={confirm}
          title="Delete Comment"
          message="Are you sure you want to delete this comment? This action cannot be undone."
        />
      </CardContent>
    </div>
  );
}