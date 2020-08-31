import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmpty, Length, Max, Min, IsEmail } from 'class-validator';

@Index('pkey_id_users', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export default class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'nome', nullable: false, type: 'varchar', length: 255 })
  @IsEmpty({ message: 'Nome não pode esta vazio' })
  @Length(5, 15, { message: 'Nome deve ter entre 5 e 15 caracteres' })
  nome: string;

  @Column({ name: 'sobrenome', nullable: false, type: 'varchar', length: 255 })
  @IsEmpty({ message: 'Sobrenome não pode esta vazio' })
  @Length(5, 15, { message: 'Sobrenome deve ter entre 5 e 15 caracteres' })
  sobrenome: string;

  @Column({ name: 'idade', nullable: false, type: 'integer' })
  @IsEmpty({ message: 'Idade não pode esta vazio' })
  @Max(130, { message: 'Idade não pode ser maior que 130' })
  @Min(1, { message: 'Idade deve ter ser maior 0' })
  idade: number;

  @Column({ name: 'foto_url', type: 'varchar', length: 255, nullable: false })
  @IsEmpty({ message: 'Usuário deve possuir uma fota de perfil' })
  foto_url: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  @IsEmpty({ message: 'Email não pode ser vazio' })
  @IsEmail({}, { message: 'Email Inválido' })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password_hash: string;

  @IsEmpty({ message: 'Senha não pode ser vazio' })
  @Length(5, 60, { message: 'Senha deve conter entre 5 e 60' })
  password: string;

  @CreateDateColumn({ name: 'created_At', type: 'timestamp', default: 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_At', type: 'timestamp', default: 'now()' })
  updateAt: Date;
}
