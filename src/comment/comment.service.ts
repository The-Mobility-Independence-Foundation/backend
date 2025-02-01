import { Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { Forum } from '../forum/forum.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(Forum)
        private readonly forumRepository: Repository<Forum>,
      ) {}

   async create() {
       const comment = new Comment();

       const user = await this.userRepository.findOneBy({id: 1});
       const post = await this.postRepository.findOneBy({id: 1});
       const forum = await this.forumRepository.findOneBy({id: 1});
       const editor = await this.userRepository.findOneBy({id: 2});

       if (user) {
           comment.author = user;
       }
       if (post) {
           comment.post = post;
       }
       if (forum) {
           comment.forum = forum;
       }
       if (editor) {
           comment.editedBy = editor;
       }
       
       comment.content = { text: "I completely agree with what you are saying"};

       return this.commentRepository.save(comment);
   }

   async findAll() {
       return this.commentRepository.find();
   }

   async findOne(id: number) {
       return this.commentRepository.findOneBy({id: id});
   }
}
