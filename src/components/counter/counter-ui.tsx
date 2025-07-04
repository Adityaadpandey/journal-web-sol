'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useState } from 'react'
import { useCounterProgram, useCounterProgramAccount } from './counter-data-access'

export function CounterCreate() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const { createEntry } = useCounterProgram()
  const { publicKey } = useWallet()

  const isFormValid = title.trim() !== '' && message.trim() !== ''

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey })
      setTitle('')
      setMessage('')
    }
  }

  if (!publicKey) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-warning/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-warning">Wallet Required</h3>
          <p className="text-base-content/70">Please connect your wallet to create journal entries</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-base-100 to-base-200 border border-base-300 rounded-2xl p-8 shadow-xl backdrop-blur-sm mb-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Create Journal Entry
        </h2>
        <p className="text-base-content/60 mt-2">Share your thoughts on the blockchain</p>
      </div>

      <div className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Title</span>
            <span className="label-text-alt text-base-content/50">{title.length}/100</span>
          </label>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={title}
            maxLength={100}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full bg-base-100 border-2 focus:border-primary focus:outline-none transition-all duration-200 hover:border-primary/50"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Message</span>
            <span className="label-text-alt text-base-content/50">{message.length}/1000</span>
          </label>
          <textarea
            placeholder="Tell your story..."
            value={message}
            maxLength={1000}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea textarea-bordered w-full h-32 bg-base-100 border-2 focus:border-primary focus:outline-none transition-all duration-200 hover:border-primary/50 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={createEntry.isPending || !isFormValid}
          className={`btn w-full h-12 text-lg font-semibold transition-all duration-300 ${
            isFormValid ? 'btn-primary hover:scale-[1.02] hover:shadow-lg' : 'btn-disabled opacity-50'
          }`}
        >
          {createEntry.isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Creating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Entry
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export function CounterList() {
  const { accounts, getProgramAccount } = useCounterProgram()

  if (getProgramAccount.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/70">Loading program...</p>
        </div>
      </div>
    )
  }

  if (!getProgramAccount.data?.value) {
    return (
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-error/10 to-error/5 border border-error/20 rounded-2xl p-8 shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-error/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-error">Program Not Found</h3>
          <p className="text-base-content/70">
            Make sure you have deployed the program and are on the correct cluster.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {accounts.isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-center space-y-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content/70">Loading entries...</p>
          </div>
        </div>
      ) : accounts.data?.length ? (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-base-content mb-2">Your Journal Entries</h2>
            <p className="text-base-content/60">
              {accounts.data.length} {accounts.data.length === 1 ? 'entry' : 'entries'} found
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {accounts.data?.map((account, index) => (
              <div
                key={account.publicKey.toString()}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CounterCard account={account.publicKey} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-base-200 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-base-content mb-2">No Entries Yet</h2>
          <p className="text-base-content/60 mb-6">
            Create your first journal entry to get started on your blockchain journey.
          </p>
        </div>
      )}
    </div>
  )
}

function CounterCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCounterProgramAccount({
    account,
  })

  const { publicKey } = useWallet()
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const title = accountQuery.data?.title
  const isFormValid = message.trim() !== ''

  const handleSubmit = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message, owner: publicKey })
      setMessage('')
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return
    }
    const title = accountQuery.data?.title
    if (title) {
      deleteEntry.mutateAsync(title)
    }
  }

  return accountQuery.isLoading ? (
    <div className="card bg-base-100 border border-base-300 shadow-lg rounded-2xl">
      <div className="card-body p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-base-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-base-200 rounded w-full"></div>
          <div className="h-4 bg-base-200 rounded w-5/6"></div>
          <div className="h-10 bg-base-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  ) : (
    <div className="card bg-gradient-to-br from-base-100 to-base-50 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group hover:scale-[1.02]">
      <div className="card-body p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h2
            className="card-title text-xl font-bold cursor-pointer hover:text-primary transition-colors duration-200 flex-1"
            onClick={() => accountQuery.refetch()}
          >
            {accountQuery.data?.title}
          </h2>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-ghost btn-sm btn-circle"
              title="Edit entry"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteEntry.isPending}
              className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
              title="Delete entry"
            >
              {deleteEntry.isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="bg-base-200/50 rounded-lg p-4 border border-base-300/30">
          <p className="text-base-content/80 leading-relaxed">{accountQuery.data?.message}</p>
        </div>

        {isEditing && (
          <div className="bg-base-200/30 rounded-lg p-4 space-y-4 border border-base-300/30 animate-fade-in">
            <label className="block text-sm font-medium text-base-content/80">Update Message</label>
            <textarea
              placeholder="Share your updated thoughts..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full resize-none focus:outline-none focus:border-primary transition-all duration-200 bg-base-100"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                className={`btn btn-primary flex-1 ${updateEntry.isPending ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={updateEntry.isPending || !isFormValid}
              >
                {updateEntry.isPending ? 'Updating...' : 'Update Entry'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setIsEditing(false)
                  setMessage('')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-base-300/30">
          <div className="flex items-center space-x-2 text-sm text-base-content/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.102m-.758 4.899L21 12H3"
              />
            </svg>
            {/* <ExplorerLink
              path={`account/${account}`}
              label={ellipsify(account.toString())}
              className="hover:text-primary transition-colors"
            /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

// Add custom CSS for animations
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = styles
  document.head.appendChild(styleElement)
}
