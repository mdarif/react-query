import React from 'react'
import { QueryClientProvider, QueryClient, useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

/**
 *
 * React Query is often described as the missing data-fetching library for React,
 * but in more technical terms, it makes fetching, caching, synchronizing and
 * updating server state in your React applications a breeze.
 */

export default function App () {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * Window Focus Refetching
         * If a user leaves your application and returns to stale data,
         * React Query automatically requests fresh data for you in the
         * background. You can disable this globally or per-query using
         * the refetchOnWindowFocus option:
         */
        refetchOnWindowFocus: false
      }
    }
  })

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Example />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

/**
 *
 * The unique key you provide is used internally for refetching, caching,
 * and sharing your queries throughout your application.
 * The query results returned by useQuery contains all of the information
 * about the query that you'll need for templating and any other usage of the data:
 */

function Example () {
  /**
   * 'error' - If the query is in an isError state, the error is available via the error property.
   * 'data' - If the query is in a success state, the data is available via the data property.
   * 'isFetching' - In any state, if the query is fetching at any time (including background refetching) isFetching will be true.
   */

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData // is made available to know what data the query is currently providing you
  } = useQuery(
    'repoData',
    async () => {
      // queryKey === ['repoData'] String-Only Query Keys
      // return fetch('https://api.github.com/repos/tannerlinsley/react-query').then(
      //   res => res.json()
      // )
      const response = await fetch(
        'https://api.github.com/repos/tannerlinsley/react-query'
      )
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    {
      refetchOnWindowFocus: false, // Disabling Per-Query
      retry: 1, // Will retry failed requests 10 times before displaying an error
      keepPreviousData: true // When the new data arrives, the previous data is seamlessly swapped to show the new data.
    }
  )

  console.log(data)

  /**
   * 'isLoading' or status === 'loading' - The query has no data and is currently fetching
   * 'isError' or status === 'error' - The query encountered an error
   * 'isSuccess' or status === 'success' - The query was successful and data is available
   * 'isIdle' or status === 'idle' - The query is currently disabled
   */

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error :(</p>
  if (isFetching) return <p>Fetching...</p> // Background Fetching Indicators

  // We can assume by this point that `isSuccess === true`
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}
