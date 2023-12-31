import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'
import { useAuth }from '../../context/AuthContext'
import { useFetch } from '../../hooks/useFetch'

import PetlistingsPageWrapper from '../../components/petlistings/PetlistingsPageWrapper';
import SearchBar from '../../components/petlistings/SearchBar';
import PetlistingsSort from '../../components/petlistings/PetlistingsSort'
import PetlistingsFilter from '../../components/petlistings/PetlistingsFilter';
import PetlistingsDisplay from '../../components/petlistings/PetlistingsDisplay';

function PetListings() {
  const { token } = useAuth()
  
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({})
  const [sortOption, setSortOption] = useState(searchParams.get('sort_by') || "none")
  const [sortAsc, setSortAsc] = useState(searchParams.get('ascending') || true)
  const [page, setPage] = useState(1)
  
  const [query, setQuery] = useState('')
  const [endPoint, setEndPoint] = useState(`/api/petlistings?sort_by=${sortOption}&ascending=${sortAsc}`)
  
  const { data } = useFetch(endPoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }, [sortOption, sortAsc], searchTerm)

  // Get complete query string
  useEffect(() => {
    let queryString = '';

    if (Object.keys(filters).length) {
      let queryFilter = new URLSearchParams(filters).toString()
      queryString = queryString + queryFilter
    }

    if (searchTerm) {
      const parseSearchArr = searchTerm.split(' ')
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
        else if(parseSearchArr[i].toLowerCase() === 'available') queryString = queryString + (queryString !== '' ? '&status=AV' : 'status=AV')
        else if(parseSearchArr[i].toLowerCase() === 'adopted') queryString = queryString + (queryString !== '' ? '&status=AD' : 'status=AD')
        else if(parseSearchArr[i].toLowerCase() === 'pending') queryString = queryString + (queryString !== '' ? '&status=PE' : 'status=PE')
        else if(parseSearchArr[i].toLowerCase() === 'withdrawn') queryString = queryString + (queryString !== '' ? '&status=WI' : 'status=WI')
        else if(parseSearchArr[i].includes('@')) queryString = queryString + (queryString !== '' ? `&shelter_email=${parseSearchArr[i]}` : `shelter_email=${parseSearchArr[i]}`)
        else name = name + (name === '' ? parseSearchArr[i] : ("%20" + parseSearchArr[i]))
      }
      if(name !== '') queryString = queryString + (queryString !== '' ? `&name=${name}` : `name=${name}`)
      searchParams.set('search', searchTerm)
    } else searchParams.delete('search')

    if (sortOption) {
      if (sortOption !== "none") {
        queryString = queryString + (queryString !== '' ? `&sort_by=${sortOption}&ascending=${sortAsc}` : `sort_by=${sortOption}&ascending=${sortAsc}`)
        searchParams.set('sort_by', sortOption)
        searchParams.set('ascending', sortAsc)
      } else {
        searchParams.delete('sort_by')
        searchParams.delete('ascending')
      }
    }
    if (page > 1) queryString = queryString + (queryString !== '' ? `&page=${page}`:`page=${page}`)
  
    setQuery(queryString)
    setSearchParams(searchParams)
  }, [searchTerm, filters, sortOption, sortAsc, page])

  // set query to send to backend
  useEffect(() => {
    if(query !== '') setEndPoint(`/api/petlistings?${query}`)
    else setEndPoint(`/api/petlistings`)
  }, [query])

  return (
    <PetlistingsPageWrapper>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <PetlistingsSort
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
      />
      <PetlistingsFilter setFilters={setFilters} />
      <PetlistingsDisplay data={data} setPage={setPage}/>
    </PetlistingsPageWrapper>
)
}

export default PetListings