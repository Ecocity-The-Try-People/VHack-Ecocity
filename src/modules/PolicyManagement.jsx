import { useState } from "react";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNotificationContext } from "../context/NotificationContext";
import { proposalsData } from "../data";
import { ProposalCard } from "../components/ProposalCard";
import { PopUpDialog } from "../components/PopUpDialog";


export default function PolicyManagement({ role = "Admin" }) {
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
    <div className="p-4">
      <div className="mb-5">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Policy Proposal & Voting</h2>
            <p className="text-gray-500">Submit new policy proposals, discuss, and vote.</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={openDialog}>
          Add Proposal
        </Button>
      </div>

      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Search proposals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <FaSearch className="text-gray-500" />
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
        />
      )}

      <Card className="w-full">
        {!filteredProposals || filteredProposals.length === 0 ? (
          <div className="text-gray-500">No proposal found!</div>
        ) :
          (
            filteredProposals.map((proposal) => (
              <motion.div key={proposal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ProposalCard
                  proposal={proposal}
                  proposals={proposals}
                  setProposals={setProposals}
                  role={role}
                />
              </motion.div>
            ))
          )}
      </Card>
    </div>
  );
}
