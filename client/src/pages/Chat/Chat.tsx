import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import ChatWindow from "../../components/Chat/ChatWindow";

const Chat = () => {
  return (
    <div className="flex h-screen bg-white dark:bg-[#050816]">

     <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;