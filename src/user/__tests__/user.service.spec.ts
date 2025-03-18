import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { UserAuthService } from '../user-auth.service';
import { UserAuth } from '../entities/user-auth.entity';
import { AuthType } from '../entities/user-auth.entity';
import { when } from 'jest-when';
import { RegisterDto } from '../../auth/dto/register.dto';
import { AuthProviderProfile } from '../../auth/entities/auth-provider-profile.entity';
import { BadRequestException } from '@nestjs/common';
import { ConnectionsService } from '../../connections/connections.service';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { Connection } from '../../connections/connection.entity';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';

describe('UserService', () => {
  let service: UserService;
  let userAuthService: UserAuthService;
  let userRepository: Repository<User>;
  let connectionsService: ConnectionsService;

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
    connectionsService = module.get(ConnectionsService);
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

  describe('getConnections', () => {
    it('should return paginated connections for a user', async () => {
      const userId = 1;
      const paginationDto = new CursorPaginationDto();
      const expectedResponse =
        new BaseApiCursorPaginationResponse<Connection>();
      Object.assign(expectedResponse, {
        results: [new Connection(), new Connection()],
        nextCursor: '2',
        hasNextPage: true,
        hasPreviousPage: false,
      });

      when(connectionsService.findAll)
        .calledWith(userId, paginationDto)
        .mockResolvedValue(expectedResponse);

      const result = await service.getConnections(userId, paginationDto);

      expect(result).toBeDefined();
      expect(result).toBe(expectedResponse);
      expect(connectionsService.findAll).toHaveBeenCalledWith(
        userId,
        paginationDto,
      );
    });
  });

  describe('createConnection', () => {
    it('should create a connection between users', async () => {
      const userId = 1;
      const recipientId = 2;
      const connection = new Connection();
      Object.assign(connection, {
        followerId: userId,
        followingId: recipientId,
      });

      when(connectionsService.create)
        .calledWith(userId, recipientId)
        .mockResolvedValue(connection);

      const result = await service.createConnection(userId, recipientId);

      expect(result).toBeDefined();
      expect(result).toBe(connection);
      expect(connectionsService.create).toHaveBeenCalledWith(
        userId,
        recipientId,
      );
    });
  });

  describe('deleteConnection', () => {
    it('should delete a connection between users', async () => {
      const userId = 1;
      const recipientId = 2;

      when(connectionsService.delete)
        .calledWith(userId, recipientId)
        .mockResolvedValue(undefined);

      await service.deleteConnection(userId, recipientId);

      expect(connectionsService.delete).toHaveBeenCalledWith(
        userId,
        recipientId,
      );
    });
  });
});
