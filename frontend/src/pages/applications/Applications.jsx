import { useEffect, useState } from 'react';
import { useAuth }from '../../context/AuthContext'
import { useFetch } from '../../hooks/useFetch';

import SearchBar from '../../components/petlistings/SearchBar';
import ApplicationSort from '../../components/applications/ApplicationSort';
import ApplicationsList from "../../components/applications/applist/ApplicationsList"
import Pagination from '../../components/ui/Pagination';
import { useSearchParams } from 'react-router-dom';

function Applications() {
  const { token, role } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sortOption, setSortOption] = useState(searchParams.get('sort_by') || 'created_time')
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1)

  const [query, setQuery] = useState('')
  const [endPoint, setEndPoint] = useState('')

  const { data } = useFetch(endPoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }, [status, sortOption], search, false)

  const next = data?.next
  const prev = data?.previous
  const curr = data?.current_page
  const total_pages = data ? data.total_pages : 0 

  useEffect(() => {
    let queryString = '';
    if(status) {
      queryString = queryString + (queryString !== '' ? `&status=${status}` : `status=${status}`)
      searchParams.set('status', status)
    } else {
      searchParams.delete('status')
    }
    if(page > 1) queryString = queryString + (queryString !== '' ? `&page=${page}`:`page=${page}`)
    if(sortOption) {
      queryString = queryString + (queryString !== '' ? `&sort_by=${sortOption}`:`sort_by=${sortOption}`)
      searchParams.set('sort_by', sortOption)
    }
    if(search) {
      const parseSearchArr = search.split(' ')
      let name = ''
      for (let i in parseSearchArr) {
        if(parseSearchArr[i].toLowerCase() === 'dog') queryString = queryString + (queryString !== '' ? '&category=D' : 'category=D')
        else if(parseSearchArr[i].toLowerCase() === 'cat') queryString = queryString + (queryString !== '' ? '&category=C' : 'category=C')
        else if(parseSearchArr[i].toLowerCase() === 'other') queryString = queryString + (queryString !== '' ? '&category=O' : 'category=O')
        else if(parseSearchArr[i].toLowerCase() === 'small') queryString = queryString + (queryString !== '' ? '&size=S' : 'size=S')
        else if(parseSearchArr[i].toLowerCase() === 'medium') queryString = queryString + (queryString !== '' ? '&size=M' : 'size=M')
        else if(parseSearchArr[i].toLowerCase() === 'large') queryString = queryString + (queryString !== '' ? '&size=L' : 'size=L')
        else if(parseSearchArr[i].toLowerCase() === 'male') queryString = queryString + (queryString !== '' ? '&gender=M' : 'gender=M')
        else if(parseSearchArr[i].toLowerCase() === 'female') queryString = queryString + (queryString !== '' ? '&gender=L' : 'gender=L')
        else if(parseSearchArr[i].toLowerCase() === 'approved') queryString = queryString + (queryString !== '' ? '&status=A' : 'status=A')
        else if(parseSearchArr[i].toLowerCase() === 'declined') queryString = queryString + (queryString !== '' ? '&status=D' : 'status=D')
        else if(parseSearchArr[i].toLowerCase() === 'pending') queryString = queryString + (queryString !== '' ? '&status=P' : 'status=P')
        else if(parseSearchArr[i].toLowerCase() === 'withdrawn') queryString = queryString + (queryString !== '' ? '&status=W' : 'status=W')
        else if(parseSearchArr[i].includes('@')) {
          queryString = queryString + (queryString !== '' ? `&${role === 'seeker' ? 'shelter' : 'seeker'}_email=${parseSearchArr[i]}` : `${role === 'seeker' ? 'shelter' : 'seeker'}_email=${parseSearchArr[i]}`)
        }
        else name = name + (name === '' ? parseSearchArr[i] : ("%20" + parseSearchArr[i]))
      }
      if(name !== '') queryString = queryString + (queryString !== '' ? `&name=${name}` : `name=${name}`)
      searchParams.set('search', search)
    } else searchParams.delete('search')
    setQuery(queryString)
    setSearchParams(searchParams)
  }, [status, page, sortOption, search])

  useEffect(() => {
    if(query !== '') setEndPoint(`/api/applications?${query}`)
    else setEndPoint(`/api/applications`)
  }, [query])

  return (
    <div style={{padding: 'var(--padding-wide)'}}>
      <SearchBar 
        searchTerm={search}
        setSearchTerm={setSearch}
      />
      <ApplicationSort
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <ApplicationsList
        applications={data ? data.results.data : []}
        status={status}
        setStatus={setStatus}
        // setSearch={setSearch}
        role={role}
      />
      <Pagination next={next} prev={prev} curr={curr} total_pages={total_pages} setPage={setPage}/>
    </div>
  )
}

export default Applications
