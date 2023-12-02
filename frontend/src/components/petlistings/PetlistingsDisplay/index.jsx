import styles from './PetlistingsDisplay.module.css'

import CardWrapper from '../../ui/cards/CardWrapper'
import Card from '../../ui/cards/Card'
import Pagination from '../../ui/Pagination'

function PetlistingsDisplay({data, setPage}) {
  const results = data ? data.results.data : []
  const next = data ? data.next : null
  const prev = data ? data.previous : null
  const curr = data ? data.current_page : null
  const total_pages = data ? data.total_pages : 0 
  return (
    <div className={styles.wrapper}>
      { results.length > 0 ? (
          <>
            <CardWrapper>
              { results.map( result => {
                let defaultImg
                if(result.category==='D') defaultImg = `images/dog-profile-2.png`
                else if(result.category==='C') defaultImg = `images/cat-profile-1.png`
                else defaultImg = `images/other-profile-1.png`
                
                return <Card 
                  key={result.id}
                  to={`/petlistings/${result.id}`} 
                  imgSrc={result.photos.length > 0 ? result.photos[0] : defaultImg} 
                  text={result.name}
                />
              })}
            </CardWrapper>
            <Pagination next={next} prev={prev} curr={curr} total_pages={total_pages} setPage={setPage}/>
          </>
        ) : (
          <p>No results found</p>
      )}
    </div>
  )
}

export default PetlistingsDisplay;