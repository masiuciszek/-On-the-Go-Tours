import * as React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { handleFlex } from '../../styles/utils/helpers'

interface LinkItem<T> {
  name: T
  path: T
}

interface Props {
  onLinks: LinkItem<string>[]
}

const StyledList = styled.ul`
  ${handleFlex('row', 'center', 'center')};
  li {
    padding: 0.5rem;
  }
  a {
    font-size: 1.6rem;
    text-transform: capitalize;
    transition: ${({ theme }) => theme.transition.mainTransition};
    padding: 1rem;
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
    }
  }
`

const FooterList: React.FC<Props> = ({ onLinks }) => {
  return (
    <StyledList>
      {onLinks.map(link => (
        <li key={link.name}>
          <Link to={link.path}>{link.name}</Link>
        </li>
      ))}
    </StyledList>
  )
}
export default FooterList
