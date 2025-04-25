import { useState, useRef, useEffect } from "react";
import { CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Reply, Trash2, ThumbsUp, Download, X } from "lucide-react";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";
import { db } from "../../config/firebase";
import { 
  collection, query, where, orderBy,
  doc, updateDoc, arrayUnion, arrayRemove, 
  deleteDoc, addDoc, serverTimestamp, getDocs
} from "firebase/firestore";
import { auth, storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onSnapshot } from "firebase/firestore";

// Image Viewer Component (unchanged)
export function ImageViewer({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <img 
          src={imageUrl} 
          alt="Full preview" 
          className="max-h-[85vh] max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/75 transition"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}

// Main Proposal Card Component with original layout
export function ProposalCard({ proposal, role, isDarkMode }) {
  // State initialization with proper defaults
  const [comment, setComment] = useState("");
  const [commentReply, setCommentReply] = useState({ 
    parentIndex: null, 
    text: "",
    parentComment: null
  });
  const [comments, setComments] = useState([]);
  const [viewingImage, setViewingImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const replyInputRef = useRef(null);
  const { isOpen, openDialog, closeDialog, confirm } = useConfirmationDialog();
  const user_collection = collection(db, "users");
    const [user, setUser] = useState({});
  
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


  // Fetch comments from subcollection
  useEffect(() => {
    if (!proposal?.id) return;
    
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const commentsRef = collection(db, "proposals", proposal.id, "comments");
        const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
          const commentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
          }));
          setComments(commentsData);
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching comments: ", error);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [proposal.id]);

  // Voting functionality (unchanged)
  const handleVote = async () => {
    try {
      const proposalRef = doc(db, "proposals", proposal.id);
      if (proposal.votedUsers?.includes(auth.currentUser.uid)) {
        await updateDoc(proposalRef, {
          votes: proposal.votes - 1,
          votedUsers: arrayRemove(auth.currentUser.uid)
        });
      } else {
        await updateDoc(proposalRef, {
          votes: proposal.votes + 1,
          votedUsers: arrayUnion(auth.currentUser.uid)
        });
      }
    } catch (error) {
      console.error("Error updating vote: ", error);
    }
  };

  // Add comment to subcollection
  const addComment = async () => {
    if (!comment.trim() || !auth.currentUser) return;
    
    try {
      const commentsRef = collection(db, "proposals", proposal.id, "comments");
      await addDoc(commentsRef, {
        userId: auth.currentUser.uid,
        userName: user?.name || "Anonymous",
        userAvatar: user?.avatar_url || "",
        text: comment.trim(),
        timestamp: serverTimestamp(),
        replies: []
      });
      setComment(""); // Reset to empty string
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  // Delete comment from subcollection
  const deleteComment = async (commentId) => {
    try {
      const commentRef = doc(db, "proposals", proposal.id, "comments", commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  // Add reply to comment in subcollection
  const addReply = async () => {
    if (!commentReply.text.trim() || !commentReply.parentComment) return;
  
    const newReply = {
      userId: auth.currentUser?.uid,
      userName: auth.currentUser?.displayName || "Anonymous",
      userAvatar: auth.currentUser?.photoURL || "",
      text: commentReply.text.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const commentRef = doc(db, "proposals", proposal.id, "comments", commentReply.parentComment.id);
      await updateDoc(commentRef, {
        replies: arrayUnion(newReply)
      });
      setCommentReply({ parentIndex: null, text: "", parentComment: null }); // Reset properly
    } catch (error) {
      console.error("Error adding reply: ", error);
    }
  };

  // File handling (unchanged)
  const handleFileView = (file) => {
    if (file.fileType?.startsWith('image/')) {
      setViewingImage(file.url);
    } else {
      window.open(file.url, '_blank');
    }
  };

  const handleFileDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name || `proposal-${proposal.id}-attachment`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Event handlers with proper controlled inputs
  const handleKeyDownComment = (e) => {
    if (e.key === "Enter") addComment();
  };

  const handleKeyDownReply = (e) => {
    if (e.key === "Enter") addReply();
  };

  // Close reply input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (replyInputRef.current && !replyInputRef.current.contains(event.target)) {
        setCommentReply({ parentIndex: null, text: "", parentComment: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasVoted = proposal.votedUsers?.includes(auth.currentUser?.uid);

  return (
    <div className="mb-5">
      <CardContent>
        <div className={`p-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}>
          {/* Proposal Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {proposal.title}
              </h3>
              <p className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {proposal.description}
              </p>
            </div>
            {(role === "Admin" || proposal.userId === auth.currentUser.uid)  && (
              <button
                onClick={() => openDialog(() => deleteProposal(proposal.id))}
                className={`p-2 rounded-full ${
                  isDarkMode 
                    ? "text-gray-400 hover:bg-gray-600 hover:text-red-400" 
                    : "text-gray-500 hover:bg-gray-200 hover:text-red-500"
                }`}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {/* File Attachment */}
          {proposal.file && (
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                  Attached File:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFileView(proposal.file)}
                    className="text-blue-500 underline cursor-pointer hover:text-blue-600"
                  >
                    {proposal.file.name || "View File"}
                  </button>
                  <button 
                    onClick={() => handleFileDownload(proposal.file)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                    title="Download file"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
              
              {proposal.file.fileType?.startsWith('image/') && (
                <div className="mt-2 max-w-xs">
                  <img 
                    src={proposal.file.url} 
                    alt="Preview" 
                    className="max-h-40 w-auto rounded border border-gray-200 cursor-pointer"
                    onClick={() => setViewingImage(proposal.file.url)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Voting Section */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleVote}
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                hasVoted 
                  ? (isDarkMode ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800")
                  : (isDarkMode ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-800")
              }`}
            >
              <ThumbsUp size={16} />
              <span>{proposal.votes || 0}</span>
            </button>
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {proposal.votedUsers?.length || 0} people voted
            </span>
          </div>

          {/* Discussion Section */}
          <div className={`mt-6 p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md`}>
            <h4 className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              Discussion ({comments.length || 0})
            </h4>

            {/* Comment Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDownComment}
                placeholder="Add a comment..."
                className={`flex-1 p-2 rounded border ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300"
                }`}
              />
              <Button onClick={addComment} variant="outline">
                Post
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={comment.id} className={`p-3 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} rounded-lg shadow-sm`}>
                  {/* Comment Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {comment.userAvatar && (
                        <img 
                          src={comment.userAvatar} 
                          alt={comment.userName} 
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                        {comment.userName}
                      </span>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {(auth.currentUser?.uid === comment.userId || role === "admin") && (
                      <button 
                        onClick={() => deleteComment(comment.id)}
                        className={`p-1 rounded-full ${
                          isDarkMode 
                            ? "text-gray-400 hover:bg-gray-700 hover:text-red-400" 
                            : "text-gray-500 hover:bg-gray-200 hover:text-red-500"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  {/* Comment Text */}
                  <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
                    {comment.text}
                  </p>
                  
                  {/* Reply Button */}
                  <button
                    onClick={() => {
                      setCommentReply({
                        parentIndex: index,
                        text: "",
                        parentComment: comment
                      });
                      setTimeout(() => replyInputRef.current?.focus(), 0);
                    }}
                    className={`flex items-center gap-1 text-xs ${
                      isDarkMode 
                        ? "text-gray-400 hover:text-gray-300" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Reply size={14} />
                    Reply
                  </button>
                  
                  {/* Reply Input */}
                  {commentReply.parentIndex === index && (
                    <div ref={replyInputRef} className="mt-3 pl-11">
                      <input
                        type="text"
                        value={commentReply.text || ""} // Ensured controlled input
                        onChange={(e) => setCommentReply({...commentReply, text: e.target.value})}
                        onKeyDown={handleKeyDownReply}
                        placeholder={`Replying to ${comment.userName}...`}
                        className={`w-full p-2 rounded border ${
                          isDarkMode 
                            ? "bg-gray-800 border-gray-700 text-white" 
                            : "bg-white border-gray-300"
                        }`}
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <Button 
                          onClick={addReply}
                          variant="outline"
                          size="sm"
                        >
                          Post Reply
                        </Button>
                        <Button 
                          onClick={() => setCommentReply({ parentIndex: null, text: "", parentComment: null })}
                          variant="ghost"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies List */}
                  {comment.replies?.length > 0 && (
                    <div className={`mt-3 space-y-3 pl-11 border-l-2 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                      {comment.replies.map((reply, replyIndex) => (
                        <div key={replyIndex} className={`p-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} rounded`}>
                          {/* Reply Header */}
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {reply.userAvatar && (
                                <img 
                                  src={reply.userAvatar} 
                                  alt={reply.userName} 
                                  className="w-6 h-6 rounded-full"
                                />
                              )}
                              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                                {reply.userName}
                              </span>
                              <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {new Date(reply.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {(auth.currentUser?.uid === reply.userId || role === "admin") && (
                              <button 
                                onClick={() => {
                                  // Handle reply deletion
                                  const updatedReplies = [...comment.replies];
                                  updatedReplies.splice(replyIndex, 1);
                                  updateDoc(doc(db, "proposals", proposal.id, "comments", comment.id), {
                                    replies: updatedReplies
                                  });
                                }}
                                className={`p-1 rounded-full ${
                                  isDarkMode 
                                    ? "text-gray-400 hover:bg-gray-700 hover:text-red-400" 
                                    : "text-gray-500 hover:bg-gray-200 hover:text-red-500"
                                }`}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          
                          {/* Reply Text */}
                          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {reply.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Viewer Modal */}
        {viewingImage && (
          <ImageViewer 
            imageUrl={viewingImage} 
            onClose={() => setViewingImage(null)} 
          />
        )}

        {/* Confirmation Dialog */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className={`p-6 rounded-lg max-w-md w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {confirm.title}
              </h3>
              <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {confirm.message}
              </p>
              <div className="flex justify-end gap-3">
                <Button onClick={closeDialog} variant="outline">
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    confirm.onConfirm();
                    closeDialog();
                  }} 
                  variant="destructive"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}