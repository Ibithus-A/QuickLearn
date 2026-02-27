"use client";

import { DashboardHome } from "@/components/dashboard-home";
import { EditorPane } from "@/components/editor-pane";
import { SignInPortal } from "@/components/sign-in-portal";
import { Sidebar } from "@/components/sidebar";
import { FlowStateProvider } from "@/context/flowstate-context";
import { normalizeEmail } from "@/lib/auth";
import { useStudentProgress } from "@/lib/hooks/use-student-progress";
import { useStudents } from "@/lib/hooks/use-students";
import { useSidebarResize } from "@/lib/hooks/use-sidebar-resize";
import { useTheme } from "@/lib/hooks/use-theme";
import type { AuthenticatedAccount } from "@/types/auth";
import { useMemo, useState } from "react";

type AppView = "workspace" | "dashboard";

export default function HomePage() {
  const [view, setView] = useState<AppView>("workspace");
  const [isSidebarAutoOpen, setIsSidebarAutoOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthenticatedAccount | null>(null);
  const { students, addStudent, deleteStudent } = useStudents();
  const effectiveCurrentUser = useMemo(() => {
    if (currentUser?.role !== "student") return currentUser;
    const isActiveStudent = students.some(
      (student) => normalizeEmail(student.email) === normalizeEmail(currentUser.email),
    );
    return isActiveStudent ? currentUser : null;
  }, [currentUser, students]);
  const {
    selectedStudentEmail,
    activeStudentUnlocks,
    currentStudentStats,
    selectedStudentMilestone,
    chapterTagsByTitle,
    selectStudent,
    toggleChapterForSelectedStudent,
    setMilestoneForSelectedStudent,
    chapterTitles,
  } = useStudentProgress(effectiveCurrentUser, students);
  const { sidebarWidth, startResize, isResizing } = useSidebarResize();
  const { isDarkMode, setIsDarkMode } = useTheme();

  const handleContinueFromSignIn = (account: AuthenticatedAccount) => {
    setCurrentUser(account);
    setView("dashboard");
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setView("dashboard");
  };

  const handleOpenDashboardFromSidebar = () => {
    setIsSidebarAutoOpen(false);
    setView("dashboard");
  };

  const handleOpenWorkspaceFromDashboard = () => {
    setIsSidebarAutoOpen(true);
    setView("workspace");
  };

  const handleCreateStudent = (name: string) => addStudent(name);

  const handleDeleteSelectedStudent = () => {
    if (!selectedStudentEmail) return;
    deleteStudent(selectedStudentEmail);
  };

  return (
    <FlowStateProvider>
      <main className="h-screen w-screen bg-[var(--surface-app)]">
        {!effectiveCurrentUser ? (
          <div className="relative h-full w-full overflow-hidden bg-[var(--surface-panel)]">
            <SignInPortal
              onClose={() => {}}
              onContinue={handleContinueFromSignIn}
              showCloseButton={false}
              students={students}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((value) => !value)}
            />
          </div>
        ) : view === "dashboard" ? (
          <DashboardHome
            name={effectiveCurrentUser.name}
            role={effectiveCurrentUser.role}
            stats={currentStudentStats}
            onOpenWorkspace={handleOpenWorkspaceFromDashboard}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((value) => !value)}
            onSignOut={handleSignOut}
            onSwitchAccount={handleSignOut}
            chapterTitles={chapterTitles}
            students={students}
            selectedStudentEmail={selectedStudentEmail}
            selectedStudentMilestone={selectedStudentMilestone}
            chapterTagsByTitle={chapterTagsByTitle}
            unlockedChapterTitles={activeStudentUnlocks}
            onSelectStudent={selectStudent}
            onSetMilestoneChapter={setMilestoneForSelectedStudent}
            onToggleChapter={toggleChapterForSelectedStudent}
            onAddStudent={handleCreateStudent}
            onDeleteSelectedStudent={handleDeleteSelectedStudent}
          />
        ) : (
          <div className="relative h-full w-full overflow-hidden bg-[var(--surface-panel)]">
            {!isSidebarAutoOpen ? (
              <button
                type="button"
                onClick={() => setIsSidebarAutoOpen(true)}
                className="absolute left-2 top-2 z-40 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                aria-label="Open sidebar"
              >
                Open sidebar
              </button>
            ) : null}

            <div className="absolute inset-y-0 left-0 z-30">
              <div
                className="absolute inset-y-0 left-0 w-4"
                onMouseEnter={() => setIsSidebarAutoOpen(true)}
                aria-hidden
              />
              <aside
                id="flowstate-sidebar"
                className={[
                  "absolute inset-y-0 left-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isSidebarAutoOpen ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
                style={{ width: `${sidebarWidth}px` }}
                onMouseEnter={() => setIsSidebarAutoOpen(true)}
                onMouseLeave={() => {
                  if (isResizing) return;
                  if (!isSidebarAutoOpen) return;
                  setIsSidebarAutoOpen(false);
                }}
              >
                <Sidebar
                  onOpenDashboard={handleOpenDashboardFromSidebar}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={() => setIsDarkMode((value) => !value)}
                  role={effectiveCurrentUser.role}
                  unlockedChapterTitles={activeStudentUnlocks}
                />
                <div
                  className="absolute inset-y-0 right-0 hidden w-2 cursor-col-resize lg:block"
                  onMouseDown={startResize}
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize sidebar"
                />
              </aside>
            </div>

            <div className="h-full">
              <EditorPane role={effectiveCurrentUser.role} />
            </div>
          </div>
        )}
      </main>
    </FlowStateProvider>
  );
}
