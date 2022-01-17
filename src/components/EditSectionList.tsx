import {
    VStack,
    Input,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Heading,
    Text,
    Flex,
    IconButton,
    useColorModeValue,
    Spacer,
    Modal,
} from '@chakra-ui/react'
import { useLightestBgColor } from '../theme'
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Section } from '../models/section'
import { useState } from 'react'
import { Game } from '../models/game'
import { TaskType } from '../models/task'
import { useDispatch } from 'react-redux'
import {
    editSection,
    deleteAllTasksFromSection,
    deleteSection,
} from '../slices/userSlice'
import { DeleteConfirmation } from './DeleteConfirmation'

type PropTypes = {
    isModalOpen: boolean
    gameData: Game
    closeModal: Function
}

export const EditSectionList = (props: PropTypes) => {
    const dispatch = useDispatch()
    const game = props.gameData
    const iconColor = useColorModeValue('black', 'white')
    const bgColor = useLightestBgColor()

    const closeModal = () => {
        props.closeModal()
    }

    const editSectionName = (section: Section) => {
        if (editedSectionName) {
            dispatch(
                editSection(game.id, {
                    ...section,
                    sectionName: editedSectionName,
                })
            )
            setEditedSectionName('')
            setIsEditing(0)
        }
    }

    const removeSection = (section: Section) => {
        dispatch(deleteAllTasksFromSection(game.id, section.id))
        dispatch(deleteSection(game.id, section.id))
    }

    const [editedSectionName, setEditedSectionName] = useState('')
    const [isEditing, setIsEditing] = useState(0)

    const renderSection = (taskType: TaskType) => {
        return (
            <VStack w="100%" bgColor={bgColor}>
                {game.sections
                    .filter((section) => section.taskType === taskType)
                    .map((section) => {
                        return (
                            <Flex w="100%">
                                {isEditing !== section.id ? (
                                    <Flex w="100%">
                                        <Text padding="5px">
                                            {section.sectionName}
                                        </Text>
                                        <Spacer />
                                        <Flex
                                            alignItems="center"
                                            marginLeft="1%"
                                            h="100%"
                                        >
                                            <IconButton
                                                size="xs"
                                                aria-label="edit-button"
                                                icon={
                                                    <EditIcon
                                                        color={iconColor}
                                                    />
                                                }
                                                onClick={() =>
                                                    setIsEditing(section.id)
                                                }
                                            />
                                            {game.sections.filter(
                                                (section) =>
                                                    section.taskType ===
                                                    taskType
                                            ).length > 1 && (
                                                <DeleteConfirmation
                                                    children={
                                                        <IconButton
                                                            size="xs"
                                                            marginLeft="5%"
                                                            aria-label="delete-button"
                                                            icon={
                                                                <DeleteIcon
                                                                    color={
                                                                        iconColor
                                                                    }
                                                                />
                                                            }
                                                        />
                                                    }
                                                    onConfirm={() =>
                                                        removeSection(section)
                                                    }
                                                />
                                            )}
                                        </Flex>
                                    </Flex>
                                ) : (
                                    <>
                                        <Flex
                                            marginLeft="1%"
                                            w="100%"
                                            alignItems="center"
                                        >
                                            <Input
                                                autoComplete="off"
                                                padding="5px"
                                                autoFocus
                                                onFocus={(e) =>
                                                    setEditedSectionName(
                                                        section.sectionName
                                                    )
                                                }
                                                value={editedSectionName}
                                                onChange={(event) =>
                                                    setEditedSectionName(
                                                        event.target.value
                                                    )
                                                }
                                                onKeyPress={(event) =>
                                                    event.key === 'Enter'
                                                        ? editSectionName(
                                                              section
                                                          )
                                                        : null
                                                }
                                            />
                                            <IconButton
                                                size="xs"
                                                aria-label="edit-submit-button"
                                                icon={
                                                    <CheckIcon
                                                        color={iconColor}
                                                    />
                                                }
                                                onClick={() =>
                                                    editSectionName(section)
                                                }
                                            />
                                            <IconButton
                                                size="xs"
                                                aria-label="edit-cancel-button"
                                                onClick={() => {
                                                    setEditedSectionName('')
                                                    setIsEditing(0)
                                                }}
                                                icon={
                                                    <CloseIcon
                                                        color={iconColor}
                                                    />
                                                }
                                            />
                                        </Flex>
                                    </>
                                )}
                            </Flex>
                        )
                    })}
            </VStack>
        )
    }

    return (
        <Modal isOpen={props.isModalOpen} onClose={() => closeModal()}>
            <ModalOverlay />
            <ModalContent h="auto" maxH="75%">
                <ModalHeader>Edit Sections</ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY="auto">
                    <VStack spacing={4} paddingBottom="5%">
                        <Heading size="sm">General Task Sections</Heading>
                        {renderSection(TaskType.NORMAL)}
                        {game.hasDaily && (
                            <>
                                <Heading size="sm">Daily Task Sections</Heading>
                                {renderSection(TaskType.DAILY)}
                            </>
                        )}
                        {game.hasWeekly && (
                            <>
                                <Heading size="sm">
                                    Weekly Task Sections
                                </Heading>
                                {renderSection(TaskType.WEEKLY)}
                            </>
                        )}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
