import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import styles from "../../NoteList.module.css";
import { Note, Tag } from "../../types";
import { format, formatDistance } from "date-fns";
import { useGetBlogPost } from "../../service/blog/queries";

type BlogListProp = {
  availableTags: Tag[];
  notes: Note[];
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
};

type SimplifiedBlog = {
  note: Note;
  id: string;
};

type EditTagModalProps = {
  show: boolean;
  availableTags: Tag[];
  handleClose: () => void;
  onUpdate: (id: string, label: string) => void;
  onDelete: (id: string) => void;
};

export function Bloglist({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag
}: BlogListProp) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [editTagModalIsOpen, setEditTagModalIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  //api call to get post here
  const { data: blogPost, isLoading } = useGetBlogPost();

  console.log({ blogPost, isLoading });

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col xs={"auto"}>
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button className="bg-[#3A2857] hover:bg-white hover:text-[#3A2857]">
                Create
              </Button>
            </Link>
            <Button
              variant="outline-secondary"
              onClick={() => setEditTagModalIsOpen(true)}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Search by Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                isMulti
                value={selectedTags.map((tags) => ({
                  label: tags.label,
                  value: tags.id
                }))}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <BlogCard note={note} id={blogPost?.[0]?.id as string} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        onUpdate={onUpdateTag}
        onDelete={onDeleteTag}
        show={editTagModalIsOpen}
        handleClose={() => setEditTagModalIsOpen(false)}
        availableTags={availableTags}
      />
    </>
  );
}
function BlogCard({ note, id }: SimplifiedBlog) {
  return (
    <Card
      as={Link}
      to={`/${note.id}/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card} `}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{note.title}</span>
          <span className="">{note.markdown.substring(0, 40)}...</span>
          <span className="text-xs text-gray-500">
            {note?.date && formatDistance(new Date(note?.date), new Date())} ago
          </span>
          {note.tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {note.tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate">
                  {tag.label}{" "}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function EditTagsModal({
  availableTags,
  handleClose,
  show,
  onDelete,
  onUpdate
}: EditTagModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    onChange={(e) => onUpdate(tag.id, e.target.value)}
                    type="text"
                    value={tag.label}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDelete(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
