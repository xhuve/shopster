import {Helmet} from 'react-helmet-async'

const Meta = ({ title='Shopster', description='Welcome to Shopster', keywords='' }) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

export default Meta