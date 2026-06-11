"use client";

import { useState } from "react";

type FormFields = {
  name: string;
  description: string;
  status: string;
};

type FormErrors = {
  name?: string;
  status?: string;
};

export default function CreateAvatarForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<FormFields>({ name: "", description: "", status: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!fields.name.trim()) e.name = "Avatar name is required.";
    if (!fields.status.trim()) e.status = "Status is required.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsOpen(false);
      setFields({ name: "", description: "", status: "" });
    }, 1500);
  }

  function handleClose() {
    if (loading) return;
    setIsOpen(false);
    setFields({ name: "", description: "", status: "" });
    setErrors({});
    setSuccess(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100"
      >
        + Create avatar
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900">Create avatar</h2>
              <button
                onClick={handleClose}
                className="text-zinc-400 hover:text-zinc-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {success ? (
              <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                Avatar created successfully!
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {/* Avatar Name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Avatar name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fields.name}
                    onChange={(e) => setFields({ ...fields, name: e.target.value })}
                    placeholder="e.g. Sofia"
                    className={`w-full rounded-xl border px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400 ${
                      errors.name ? "border-red-400 bg-red-50" : "border-zinc-200 bg-zinc-50"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Description
                  </label>
                  <textarea
                    value={fields.description}
                    onChange={(e) => setFields({ ...fields, description: e.target.value })}
                    placeholder="Optional — e.g. Friendly tutor from Mexico City"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fields.status}
                    onChange={(e) => setFields({ ...fields, status: e.target.value })}
                    placeholder="e.g. Active"
                    className={`w-full rounded-xl border px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400 ${
                      errors.status ? "border-red-400 bg-red-50" : "border-zinc-200 bg-zinc-50"
                    }`}
                  />
                  {errors.status && (
                    <p className="mt-1 text-xs text-red-500">{errors.status}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 rounded-full bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
                >
                  {loading ? "Saving…" : "Save avatar"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
