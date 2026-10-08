import { useEffect, useState } from "react";
import { Search, Check, X, Eye, Building2, Ban } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Drawer from "@/components/ui/Drawer";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { getCompanies, approveCompany, rejectCompany, suspendCompany } from "@/api/ownerApi";
import type { Company } from "@/types";

type ActionType = "approve" | "reject" | "suspend";

export default function CompanyManagement() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Company | null>(null);
  const [confirm, setConfirm] = useState<{ action: ActionType; company: Company } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCompanies();
      setCompanies(res.data);
    } catch {
      setError("Failed to load companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

const filtered = companies.filter((c) => {
  const companyName = String(c.name ?? "");
  const companyCode = String(c.companyCode ?? "");

  const matchSearch =
    companyName
      .toLowerCase()
      .includes(String(search ?? "").toLowerCase()) ||
    companyCode
      .toLowerCase()
      .includes(String(search ?? "").toLowerCase());

  const matchStatus =
    statusFilter === "ALL" ||
    c.approvalStatus === statusFilter;

  return matchSearch && matchStatus;
});
  const handleAction = async () => {
    if (!confirm) return;
    setActionLoading(true);
    try {
      if (confirm.action === "approve") await approveCompany(confirm.company.id);
      else if (confirm.action === "reject") await rejectCompany(confirm.company.id);
      else await suspendCompany(confirm.company.id);
      toast(`Company ${confirm.action}d successfully.`);
      fetch();
    } catch {
      toast("Action failed. Please try again.", "error");
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  };

  return (
    <AppLayout breadcrumb={["Owner", "Companies"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Company Management</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Review and manage company registrations and access.</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#374151] focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6"><LoadingSkeleton /></div>
          ) : error ? (
            <ErrorState message={error} onRetry={fetch} />
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Building2 className="w-10 h-10 text-gray-300" />} title="No companies found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {["Company", "Industry", "Type", "City", "HR Contact", "Registered", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#111827] whitespace-nowrap">{c.companyName}</p>
                        <p className="text-xs text-[#9CA3AF] font-mono">{c.companyCode}</p>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">{c.industry ?? "—"}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{c.companyType ?? "—"}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{c.city ?? "—"}</td>
                      <td className="px-4 py-3">
                        <p className="text-[#374151]">{c.hrName ?? "—"}</p>
                        <p className="text-xs text-[#9CA3AF]">{c.hrEmail ?? ""}</p>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{c.registrationDate?.split("T")[0]}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.approvalStatus} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelected(c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          {c.approvalStatus === "PENDING" && (
                            <>
                              <button onClick={() => setConfirm({ action: "approve", company: c })} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600" title="Approve">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => setConfirm({ action: "reject", company: c })} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Reject">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {c.approvalStatus === "APPROVED" && (
                            <button onClick={() => setConfirm({ action: "suspend", company: c })} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500" title="Suspend">
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Company Details">
        {selected && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111827]">{selected.companyName}</h3>
                <StatusBadge status={selected.approvalStatus} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Company Code", selected.companyCode],
                ["Industry", selected.industry ?? "—"],
                ["Company Type", selected.companyType ?? "—"],
                ["City", selected.city ?? "—"],
                ["State", selected.state ?? "—"],
                ["Website", selected.website ?? "—"],
                ["Corporate Email", selected.corporateEmail ?? "—"],
                ["HR Name", selected.hrName ?? "—"],
                ["HR Email", selected.hrEmail ?? "—"],
                ["HR Phone", selected.hrPhone ?? "—"],
                ["Registered", selected.registrationDate?.split("T")[0]],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-[#9CA3AF] mb-0.5">{k}</p>
                  <p className="text-sm font-medium text-[#374151]">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
              {selected.approvalStatus === "PENDING" && (
                <>
                  <button onClick={() => { setSelected(null); setConfirm({ action: "approve", company: selected }); }} className="flex-1 py-2.5 text-sm font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] transition-colors">Approve</button>
                  <button onClick={() => { setSelected(null); setConfirm({ action: "reject", company: selected }); }} className="flex-1 py-2.5 text-sm font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">Reject</button>
                </>
              )}
              {selected.approvalStatus === "APPROVED" && (
                <button onClick={() => { setSelected(null); setConfirm({ action: "suspend", company: selected }); }} className="flex-1 py-2.5 text-sm font-medium border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">Suspend</button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirm}
        title={`${confirm?.action?.charAt(0).toUpperCase()}${confirm?.action?.slice(1)} Company`}
        description={`Are you sure you want to ${confirm?.action} ${confirm?.company?.companyName}?`}
        confirmLabel={confirm?.action?.charAt(0).toUpperCase() + (confirm?.action?.slice(1) ?? "")}
        danger={confirm?.action !== "approve"}
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setConfirm(null)}
      />
    </AppLayout>
  );
}
