import { IconClose } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { useChatSessions } from "@/hooks/useAssistant";
import {
  MessageSquare,
  Search,
  Plus,
  Loader2,
  MenuIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DeleteSessionDialog, RenameSessionDialog } from "..";

export const AllSessionsDialog = ({ customTrigger = null }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [allSessions, setAllSessions] = useState([]);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const navigate = useNavigate();
  const pageSize = 10;

  const { data, isLoading, isFetching } = useChatSessions(
    page,
    pageSize,
    search,
    {
      onSuccess: (res) => {
        const newSessions = res?.data?.content || [];
        if (page === 0) {
          setAllSessions(newSessions);
        } else {
          setAllSessions((prev) => [...prev, ...newSessions]);
          setHasLoadedMore(true);
        }
      },
    },
  );

  const hasNext = data?.data?.hasNext || false;

  const handleSessionClick = (sessionId) => {
    navigate(ROUTES.chatSession(sessionId));
    setOpen(false);
  };

  const handleNewChat = () => {
    navigate(ROUTES.aiAssistant);
    setOpen(false);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(0);
    setAllSessions([]);
    setHasLoadedMore(false);
  };

  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      setPage(0);
      setSearch("");
      setAllSessions([]);
      setHasLoadedMore(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const sessions =
    allSessions.length > 0 ? allSessions : data?.data?.content || [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button size="sm" variant="secondary">
            All Chats
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8 rounded-[12px] bg-white max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-0!">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-2xl font-bold">
              Recent Chats
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>
          <DialogDescription>
            View and manage all your previous chat sessions with FinPulse
          </DialogDescription>
        </DialogHeader>

        {/* Search and New Chat */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-white"
            />
          </div>
          <Button onClick={handleNewChat} className="gap-1.5 h-9.5">
            <Plus className="size-4" />
            New Chat
          </Button>
        </div>

        {/* Session List */}
        <div className="flex flex-col gap-1 max-h-80 overflow-y-auto no-scrollbar">
          {isLoading && page === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-grey-500">
              <Loader2 className="size-4 animate-spin mr-2" />
              Loading chats...
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-grey-500">
              <MessageSquare className="size-8 mb-2 opacity-40" />
              <p className="text-sm">
                {search ? "No chats match your search" : "No conversations yet"}
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <div className="flex items-center rounded-lg  hover:bg-beige-100 transition-colors ">
                <button
                  key={session.id}
                  onClick={() => handleSessionClick(session.id)}
                  className="flex items-center gap-3 px-3 py-3 text-left  w-full"
                >
                  <MessageSquare className="size-4 text-grey-400 group-hover:text-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.title}
                    </p>
                  </div>
                  <span className="text-xs text-grey-400 flex-shrink-0">
                    {formatDate(session.lastUpdatedAt || session.createdAt)}
                  </span>
                </button>
                <SessionActionsPopover
                  session={session}
                  sessionId={session.id}
                />
              </div>
            ))
          )}
        </div>

        {/* Show More */}
        {hasNext && (
          <div className="flex justify-center pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowMore}
              disabled={isFetching}
              className="text-grey-500 hover:text-foreground"
            >
              {isFetching ? (
                <>
                  <Loader2 className="size-3 animate-spin mr-1.5" />
                  Loading...
                </>
              ) : (
                "Show more"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const SessionActionsPopover = ({ session, sessionId }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className=" p-2  transition-opacity  text-grey-500 hover:bg-white rounded-sm mr-2 flex-shrink-0">
          <MoreHorizontalIcon />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-40 p-1.5 shadow-none text-sm font-medium gap-0">
        <RenameSessionDialog
          session={session}
          customTrigger={
            <div className="flex items-center p-5 hover:bg-beige-100 rounded-md px-2 py-1 cursor-pointer">
              <span>
                <EditIcon className="size-4" />
              </span>
              <span className="ml-2 text-sm text-grey-700">Rename</span>
            </div>
          }
        />

        <hr className="h-px w-full my-1 bg-beige-100" />
        <DeleteSessionDialog
          sessionId={sessionId}
          customTrigger={
            <div className="flex items-center p-5  hover:bg-red-sec/10 hover:text-red-sec rounded-md px-2 py-1 cursor-pointer">
              <span>
                <TrashIcon className="size-4" />
              </span>
              <span className="ml-2 text-sm text-grey-700">Delete</span>
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  );
};
