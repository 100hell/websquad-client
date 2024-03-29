import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import ActionLogo from './ActionLogo'

const UserPost = ({ likes, replies, postImg, postTitle }) => {
    const [liked, setLiked] = useState(false)
    return (
        <Link to={"/markzuckerberg/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={"md"} name='mark zuckerberg' src='zuck-avatar.png' />
                    <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box w={"full"} position={"relative"} >
                        <Avatar position={"absolute"} top={"0px"} left={"15px"} padding={"2px"} size={"xs"} name='john doe' src='https://bit.ly/kent-c-dodds' />
                        <Avatar position={"absolute"} bottom={"0px"} right={"-5px"} padding={"2px"} size={"xs"} name='Christian Nwamba' src='https://bit.ly/code-beast' />
                        <Avatar position={"absolute"} bottom={"0px"} left={"4px"} padding={"2px"} size={"xs"} name='Prosper Otemuyiwa' src='https://bit.ly/prosper-baba' />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} width={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"} >markzuckerberg</Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
                            <BsThreeDots />

                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{postTitle}</Text>
                    {postImg && (
                        <Box position={"relative"} borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={postImg} w={"full"}></Image>
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <ActionLogo liked={liked} setLiked={setLiked} />
                    </Flex>
                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={"sm"}>{replies} replies</Text>
                        <Box w={".5"} h={".5"} borderRadius={"full"} background={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize={"sm"}>{likes + (liked ? 1 : 0)} likes</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}

export default UserPost
