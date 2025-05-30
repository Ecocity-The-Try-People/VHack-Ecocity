import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNotificationContext } from "../context/NotificationContext";
import { PopUpDialog } from "../components/PopUpDialog";
import SmartCityVideo from "../assets/videos/Smart-City.mp4";
import useDarkMode from "../hooks/DarkMode.jsx";
import { auth, db } from "../../config/firebase";
import { collection, addDoc, onSnapshot, query, serverTimestamp } from "firebase/firestore";
import { ProposalCard } from "../components/ProposalCard.jsx";

export default function PolicyManagement({ userRole }) {
  const isDarkMode = useDarkMode();
  const [proposals, setProposals] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newProposal, setNewProposal] = useState({ 
    title: "", 
    description: "", 
    file: null,
    fileName: null,
    fileType: null,
    votes: 0,
    comments: [],
    createdAt: new Date(),
    createdBy: userRole
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { showNotification } = useNotificationContext() || {};
  const [submitted, setSubmitted] = useState(false);

  // Fetch proposals from Firestore
  useEffect(() => {
    const proposalsRef = collection(db, "proposals");
    const q = query(proposalsRef);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const proposalsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Validate required fields
        if (data.title && data.description) {
          proposalsData.push({ 
            id: doc.id, 
            title: data.title || '',
            description: data.description || '',
            votes: data.votes || 0,
            votedUsers:data.votedUsers || [],
            comments: data.comments || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            createdBy: data.createdBy || 'anonymous',
            status: data.status || 'pending',
            file: data.file || null,          // base64 string
            fileName: data.fileName || null,
            fileType: data.fileType || null,
            userId:data.userId
          });
        }
      });
      setProposals(proposalsData);
    });
  
    return () => unsubscribe();
  }, []);

  function openDialog() {
    setOpenModal(true);
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type (allow images and PDFs)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload only PNG, JPG, or PDF files', 'error');
      return;
    }

    // Check file size (limit to 2MB for base64)
    if (file.size > 2 * 1024 * 1024) {
      showNotification('File size too large (max 2MB)', 'error');
      return;
    }

    setLoading(true);

    try {
      const base64String = await convertToBase64(file);
      setNewProposal({
        ...newProposal,
        file: base64String,
        fileName: file.name,
        fileType: file.type
      });
    } catch (error) {
      console.error("Error converting file:", error);
      showNotification("Error processing file", "error");
    } finally {
      setLoading(false);
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  async function addProposal() {
    setSubmitted(true);
    if (!newProposal.title || !newProposal.description) {
      showNotification("Please provide title and description", "error");
      return;
    }

    try {
      const proposalsRef = collection(db, "proposals");
      await addDoc(proposalsRef, {
        title: newProposal.title,
        description: newProposal.description,
        file: newProposal.file,          // base64 string
        fileName: newProposal.fileName,   // original filename
        fileType: newProposal.fileType,   // file type
        votes: 0,
        votedUsers: [],
        comments: [],
        createdAt: serverTimestamp(),
        createdBy: userRole,
        status: "pending",
        userId: auth.currentUser.uid
      });

      showNotification("Proposal submitted successfully!", "success");
      setOpenModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding proposal: ", error);
      showNotification("Failed to submit proposal", "error");
    }
  }

  function resetForm() {
    setNewProposal({ 
      title: "", 
      description: "", 
      file: null,
      fileName: null,
      fileType: null,
      votes: 0,
      comments: [],
      createdAt: new Date(),
      createdBy: userRole,
      userId:auth.currentUser.uid
    });
    setSubmitted(false);
  }

  const filteredProposals = proposals.filter((p) =>
    p?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative min-h-screen`}>
      <div className="fixed inset-0 z-0 overflow-hidden ml-20" style={{ opacity: isDarkMode ? 0.3 : 0.5 }}>
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        >
          <source src={SmartCityVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className={`fixed inset-0 -z-10 ml-20 ${
        isDarkMode ? "bg-[hsla(180,0%,10%,0.8)]" : "bg-[hsla(0,0%,100%,0.8)]"
      }`} />

      <div className="relative z-10 p-4">
        <div className="mb-5">
          <Card className={`${isDarkMode ? "bg-[hsla(180,0%,10%,0.8]" : "bg-white/90"} ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Policy Proposal & Voting</h2>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Submit new policy proposals, discuss, and vote.</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mb-4">
          <Button className={`${isDarkMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-700"} px-4 py-2 rounded transition`} onClick={openDialog}>
            Add Proposal
          </Button>
        </div>

        <div className="flex gap-2 items-center mb-4 p-2 rounded-lg">
          <input
            type="text"
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 p-2 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <FaSearch className={`${isDarkMode ? "text-gray-300" : "text-gray-500"} cursor-pointer`} />
        </div>

        {openModal && (
          <PopUpDialog
            newProposal={newProposal}
            setNewProposal={setNewProposal}
            handleFileChange={handleFileChange}
            addProposal={addProposal}
            closeDialog={() => {
              setOpenModal(false);
              resetForm();
            }}
            loading={loading}
            submitted={submitted}
          />
        )}

        <Card className={`w-full ${isDarkMode ? "bg-[hsla(180,0%,10%,0.8]" : "bg-white/90"} ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          {!filteredProposals || filteredProposals.length === 0 ? (
            <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} p-4`}>No proposal found!</div>
          ) : (
            filteredProposals.map((proposal) => (
              <motion.div key={proposal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ProposalCard
                  proposal={proposal}
                  proposals={proposals}
                  setProposals={setProposals}
                  role={userRole}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}