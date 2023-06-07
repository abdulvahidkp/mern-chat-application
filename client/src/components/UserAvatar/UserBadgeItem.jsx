import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

function UserBadgeItem({user, handleFunction}) {
  return (
    <Box 
    px={2}
    py={1}
    borderRadius='lg'
    m={1}
    mb={2}
    fontSize={12}
    backgroundColor='purple'
    cursor='pointer'
    color='white'
    display='flex'
    alignItems='center'
    onClick={handleFunction}
    >
        {user.name}
        <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem