// import { Card, CardContent } from "@/components/Card";
// import { Button } from "../components/Button";

// export default function PolicyManagement() {
//   return (
//     <>
//       <div className="p-4">
//         <div className="mb-5">
//           <Card>
//             <CardContent>
//               <h2 className="text-xl font-semibold mb-2">Policy Proposal & Voting</h2>
//               <p className="text-gray-500 break-words whitespace-normal">
//                 Accept new policy propsed, bring in discussion, vote by citizen.
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         <div>
//           <Card>
//             <CardContent>
//               <div className="flex flex-row-reverse mb-4">
//                 <Button variant={""} className={""} children={"Add Proposal"} onClick={""} />
//               </div>

//               <div className="bg-gray-300 dark:bg-gray-500 p-4 shadow-md rounded-lg w-full min-h-[80px] break-words flex justify-center align-middle">
//                 <div className="" >
//                   <h1 className="text-3xl font-bold">Title</h1>
//                   <h5 className="">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae aspernatur nobis vitae, atque vel illo non velit nam a omnis ex eaque tempora, libero error.</h5>
//                 </div>

//                 <div className="flex-col-reverse flex" >
//                   <Button variant={""} className={"bg-green-500 h-10"} children={"Vote"} onClick={""} />
//                 </div>

//                 {/* <Reply></Reply> */}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }

import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";

// Sample Proposal Data
const proposals = [
  {
    id: 1,
    title: "Traffic Regulation Update",
    description: "Proposal to enforce stricter speed limits in residential areas to reduce accidents.",
  },
  {
    id: 2,
    title: "Waste Management Reform",
    description: "Introducing a new recycling initiative to promote sustainable waste disposal.",
  },
  {
    id: 3,
    title: "Public Transport Expansion",
    description: "Plan to add new bus routes and optimize existing ones to ease congestion.",
  },
];

export default function PolicyManagement() {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-5">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Policy Proposal & Voting</h2>
            <p className="text-gray-500 break-words whitespace-normal">
              Accept new policies proposed, bring them into discussion, and vote by citizens.
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Proposals List */}
      <div className="flex flex-row-reverse mb-4">
        <Card className="w-full">
          {/* Add Proposal Button */}
          <div className="flex justify-end mb-4">
            <Button variant="primary" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => alert("Add Proposal Clicked")}>
              Add Proposal
            </Button>
          </div>

          <div>
            <CardContent>
              {proposals.map((proposal) => (
                <ProposalCard key={proposal.id} title={proposal.title} description={proposal.description} />
              ))}
            </CardContent>
          </div>

        </Card>
      </div>
    </div>
  );
}

// Proposal Card Component
function ProposalCard({ title, description }) {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 flex">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-3 break-words">{description}</p>

      <div className="justify-end">
        <Button variant="success" className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => alert("Voted")}>
          Vote
        </Button>
      </div>
    </div>
  );
}
