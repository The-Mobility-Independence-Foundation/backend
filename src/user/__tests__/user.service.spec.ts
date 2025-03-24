import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { UserAuthService } from '../user-auth.service';
import { UserAuth } from '../entities/user-auth.entity';
import { AuthType } from '../entities/user-auth.entity';
import { when } from 'jest-when';
import { RegisterDto } from '../../auth/dto/register.dto';
import { AuthProviderProfile } from '../../auth/entities/auth-provider-profile.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { PaginationService } from '../../common/services/pagination.service';

describe('UserService', () => {
  let service: UserService;
  let userAuthService: UserAuthService;
  let userRepository: Repository<User>;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(UserService);
    userAuthService = module.get(UserAuthService);
    userRepository = module.get(getRepositoryToken(User));
    paginationService = module.get(PaginationService);
  });

  describe('findByEmail', () => {
    it('should find a user auth by email', async () => {
      const user = new User();
      Object.assign(user, {
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      when(userRepository.findOne)
        .calledWith({ where: { email: user.email } })
        .mockResolvedValue(user);

      const result = await service.findByEmail(user.email);

      expect(result).toBeDefined();
      expect(result).toBe(user);
    });

    it('should find a user auth by email with additional where conditions', async () => {
      const user = new User();
      Object.assign(user, {
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      when(userRepository.findOne)
        .calledWith({
          where: { email: user.email, firstName: user.firstName },
        })
        .mockResolvedValue(user);

      const result = await service.findByEmail(user.email, {
        where: { firstName: user.firstName },
      });

      expect(result).toBeDefined();
      expect(result).toBe(user);
    });

    it('should find a user auth by email with additional relations', async () => {
      const user = new User();
      Object.assign(user, {
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      const userAuth = new UserAuth();
      user.auth = userAuth;
      userAuth.user = user;

      when(userRepository.findOne)
        .calledWith({ where: { email: user.email }, relations: { auth: true } })
        .mockResolvedValue(user);

      const result = await service.findByEmail(user.email, {
        relations: { auth: true },
      });

      expect(result).toBeDefined();
      expect(result).toBe(user);
      expect(result?.auth).toBe(userAuth);
    });

    it('should find a user auth by email regardless of the case of the email', async () => {
      const user = new User();
      Object.assign(user, {
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      when(userRepository.findOne)
        .calledWith({ where: { email: user.email } })
        .mockResolvedValue(user);

      const result = await service.findByEmail(user.email.toUpperCase());

      expect(result).toBe(user);
    });

    it('should return null if the user auth is not found', async () => {
      when(userRepository.findOne).mockResolvedValue(null);

      const result = await service.findByEmail('test@test.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a user record with a register dto', async () => {
      const registerDto = new RegisterDto();
      Object.assign(registerDto, {
        email: 'test@test.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      const userAuth = new UserAuth();
      userAuth.type = AuthType.LOCAL;
      userAuth.identifier = registerDto.email;
      userAuth.credentials = registerDto.password;

      when(userRepository.findOne).mockResolvedValue(null);
      when(userAuthService.findByIdentifier).mockResolvedValue(null);
      when(userAuthService.initializeLocalAuth).mockResolvedValue(userAuth);
      when(userRepository.save).mockImplementation((user: User) => {
        return Promise.resolve(user);
      });

      const result = await service.create(registerDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(registerDto.email);
      expect(result.firstName).toBe(registerDto.firstName);
      expect(result.lastName).toBe(registerDto.lastName);
      expect(result.displayName).toBe(registerDto.displayName);

      expect(result.auth).toStrictEqual(userAuth);
    });

    it('should create a user record with a provider profile', async () => {
      const authProviderProfile = new AuthProviderProfile();
      authProviderProfile.id = '1234567890';
      authProviderProfile.provider = AuthType.GOOGLE;
      authProviderProfile.accessToken = 'accessToken';
      authProviderProfile.refreshToken = 'refreshToken';
      authProviderProfile.displayName = 'John Doe';
      authProviderProfile.firstName = 'John';
      authProviderProfile.lastName = 'Doe';
      authProviderProfile.email = 'test@test.com';
      authProviderProfile.image = 'image';

      const userAuth = new UserAuth();
      userAuth.type = authProviderProfile.provider;
      userAuth.identifier = authProviderProfile.email;
      userAuth.providerAccountId = authProviderProfile.id;
      userAuth.accessToken = authProviderProfile.accessToken;
      userAuth.refreshToken = authProviderProfile.refreshToken;

      when(userRepository.findOne).mockResolvedValue(null);
      when(userAuthService.findByIdentifier).mockResolvedValue(null);
      when(userAuthService.initializeProviderAuth).mockResolvedValue(userAuth);
      when(userRepository.save).mockImplementation((user: User) => {
        return Promise.resolve(user);
      });

      const result = await service.create(authProviderProfile);

      expect(result).toBeDefined();
      expect(result.email).toBe(authProviderProfile.email);
      expect(result.firstName).toBe(authProviderProfile.firstName);
      expect(result.lastName).toBe(authProviderProfile.lastName);
      expect(result.displayName).toBe(authProviderProfile.displayName);

      expect(result.auth).toStrictEqual(userAuth);
    });

    it('should throw a bad request exception if the user already exists', async () => {
      const registerDto = new RegisterDto();
      registerDto.email = 'test@test.com';
      registerDto.password = 'password';
      registerDto.firstName = 'John';
      registerDto.lastName = 'Doe';
      registerDto.displayName = 'John Doe';

      when(userRepository.findOne).mockResolvedValue(new User());
      when(userAuthService.findByIdentifier).mockResolvedValue(new UserAuth());

      await expect(service.create(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user if a user with the id exists', async () => {
      const user = new User();
      Object.assign(user, {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      when(userRepository.findOne)
        .calledWith({ where: { id: user.id } })
        .mockResolvedValue(user);

      const result = await service.findById(user.id);

      expect(result).toBeDefined();
      expect(result).toBe(user);
    });

    it('should return null if no user with the id exists', async () => {
      const bad_id = 999999999;

      when(userRepository.findOne)
        .calledWith({ where: { id: bad_id } })
        .mockResolvedValue(null);

      await expect(service.findById(bad_id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return an error if there is no user with the specified id', async () => {
      const bad_id = 999999999;

      when(userRepository.findOne)
        .calledWith({ where: { id: bad_id } })
        .mockResolvedValue(null);

      await expect(service.update(bad_id, new UpdateUserDto())).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update the first name if the user exists', async () => {
      const user = new User();
      Object.assign(user, {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      const dto = new UpdateUserDto();
      Object.assign(dto, {
        firstName: 'NotJohn',
      });

      when(userRepository.findOne)
        .calledWith({ where: { id: user.id } })
        .mockResolvedValue(user);

      when(userRepository.save).mockImplementation((user: User) => {
        return Promise.resolve(user);
      });

      const result = await service.update(user.id, dto);

      expect(result).toBeDefined();
      expect(result.firstName).toBe(dto.firstName);
      expect(result.lastName).toBe(user.lastName);
      expect(result.displayName).toBe(user.displayName);
      expect(result.type).toBe(user.type);
    });

    it('should update the last name if the user exists', async () => {
      const user = new User();
      Object.assign(user, {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      const dto = new UpdateUserDto();
      Object.assign(dto, {
        lastName: 'NotDoe',
      });

      when(userRepository.findOne)
        .calledWith({ where: { id: user.id } })
        .mockResolvedValue(user);

      when(userRepository.save).mockImplementation((user: User) => {
        return Promise.resolve(user);
      });

      const result = await service.update(user.id, dto);

      expect(result).toBeDefined();
      expect(result.firstName).toBe(user.firstName);
      expect(result.lastName).toBe(dto.lastName);
      expect(result.displayName).toBe(user.displayName);
      expect(result.type).toBe(user.type);
    });

    it('should update the displayname if the user exists', async () => {
      const user = new User();
      Object.assign(user, {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      const dto = new UpdateUserDto();
      Object.assign(dto, {
        displayName: 'NotJohnDoe',
      });

      when(userRepository.findOne)
        .calledWith({ where: { id: user.id } })
        .mockResolvedValue(user);

      when(userRepository.save).mockImplementation((user: User) => {
        return Promise.resolve(user);
      });

      const result = await service.update(user.id, dto);

      expect(result).toBeDefined();
      expect(result.firstName).toBe(user.firstName);
      expect(result.lastName).toBe(user.lastName);
      expect(result.displayName).toBe(dto.displayName);
      expect(result.type).toBe(user.type);
    });

    it('should update the user type if the user exists', async () => {
      const user = new User();
      Object.assign(user, {
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
      });

      const dto = new UpdateUserDto();
      Object.assign(dto, {
        accountType: UserRole.ADMIN,
      });

      when(userRepository.findOne)
        .calledWith({ where: { id: user.id } })
        .mockResolvedValue(user);

      when(userRepository.save).mockImplementation((user: User) => {
        return Promise.resolve(user);
      });

      const result = await service.update(user.id, dto);

      expect(result).toBeDefined();
      expect(result.firstName).toBe(user.firstName);
      expect(result.lastName).toBe(user.lastName);
      expect(result.displayName).toBe(user.displayName);
      expect(result.type).toBe(dto.accountType);
    });
  });

  describe('findAll', () => {
    it('should use displayName when username is specified', async () => {
      const dto = new GetUsersDto();
      Object.assign(dto, {
        username: 'John E. Test',
      });

      service.findAll(dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        userRepository,
        new CursorPaginationDto(),
        expect.objectContaining({
          where: {
            displayName: dto.username,
          },
        }),
      );
    });

    it('should use type when accountType is specified', async () => {
      const dto = new GetUsersDto();
      Object.assign(dto, {
        accountType: UserRole.ADMIN,
      });

      service.findAll(dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        userRepository,
        new CursorPaginationDto(),
        expect.objectContaining({
          where: {
            type: dto.accountType,
          },
        }),
      );
    });
  });
});
