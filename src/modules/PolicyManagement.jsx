import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNotificationContext } from "../context/NotificationContext";
import { proposalsData } from "../data";
import { ProposalCard } from "../components/ProposalCard";
import { PopUpDialog } from "../components/PopUpDialog";
import SmartCityVideo from "../assets/videos/Smart-City.mp4";
import useDarkMode from "../hooks/DarkMode.jsx";

export default function PolicyManagement({ userRole }) {
  const isDarkMode = useDarkMode();
  const [proposals, setProposals] = useState(proposalsData);
  const [openModal, setOpenModal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: "", description: "", file: null });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { showNotification } = useNotificationContext() || {};
  const [submitted, setSubmitted] = useState(false);

  function openDialog() {
    setOpenModal(true);
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setLoading(true);
      setTimeout(() => {
        setNewProposal((prev) => ({ ...prev, file: selectedFile }));
        setLoading(false);
      }, 1500);
    }
  }

  function addProposal() {
    setSubmitted(true);
    if (!newProposal.title || !newProposal.description || !newProposal.file) {
      showNotification("Please provide all fields including a document.", "error");
      return;
    }

    setProposals([
      ...proposals,
      {
        id: proposals.length + 1,
        title: newProposal.title,
        description: newProposal.description,
        file: newProposal.file,
        votes: 0,
        comments: [],
      },
    ]);

    showNotification("Proposal submitted successfully!", "success");
    setOpenModal(false);
    setNewProposal({ title: "", description: "", file: null });
  }

  const filteredProposals = proposals.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
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

      <div className="fixed inset-0 z-0 bg-[hsla(180,0%,10%,0.6)] ml-20" />

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
          <Button className={`${isDarkMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-700"} px-4 py-2 rounded transition` } onClick={openDialog}>
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
          <FaSearch className={`${isDarkMode ? "text-gray-300" : "text-gray-500"}`} />
        </div>

        {openModal && (
          <PopUpDialog
            newProposal={newProposal}
            setNewProposal={setNewProposal}
            handleFileChange={handleFileChange}
            addProposal={addProposal}
            closeDialog={() => setOpenModal(false)}
            loading={loading}
            submitted={submitted}
            isDarkMode={isDarkMode}
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