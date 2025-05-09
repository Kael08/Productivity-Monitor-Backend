PGDMP  
                    }            productivity-monitor-db    16.6    16.6 *    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16405    productivity-monitor-db    DATABASE     �   CREATE DATABASE "productivity-monitor-db" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
 )   DROP DATABASE "productivity-monitor-db";
                postgres    false            �            1259    32790    notes    TABLE       CREATE TABLE public.notes (
    id integer NOT NULL,
    user_id integer,
    title character varying(255),
    content text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.notes;
       public         heap    postgres    false            �            1259    32789    notes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.notes_id_seq;
       public          postgres    false    222            �           0    0    notes_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;
          public          postgres    false    221            �            1259    24623    refresh_tokens    TABLE     )  CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_revoked boolean DEFAULT false
);
 "   DROP TABLE public.refresh_tokens;
       public         heap    postgres    false            �            1259    24622    refresh_tokens_id_seq    SEQUENCE     �   CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.refresh_tokens_id_seq;
       public          postgres    false    220            �           0    0    refresh_tokens_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;
          public          postgres    false    219            �            1259    32873 
   todo_items    TABLE     R  CREATE TABLE public.todo_items (
    id integer NOT NULL,
    todo_list_id integer NOT NULL,
    description text NOT NULL,
    is_completed boolean DEFAULT false,
    priority integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.todo_items;
       public         heap    postgres    false            �            1259    32872    todo_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.todo_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.todo_items_id_seq;
       public          postgres    false    226            �           0    0    todo_items_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.todo_items_id_seq OWNED BY public.todo_items.id;
          public          postgres    false    225            �            1259    32859 
   todo_lists    TABLE       CREATE TABLE public.todo_lists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.todo_lists;
       public         heap    postgres    false            �            1259    32858    todo_lists_id_seq    SEQUENCE     �   CREATE SEQUENCE public.todo_lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.todo_lists_id_seq;
       public          postgres    false    224            �           0    0    todo_lists_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.todo_lists_id_seq OWNED BY public.todo_lists.id;
          public          postgres    false    223            �            1259    24598    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    24609    users_credentials    TABLE     �   CREATE TABLE public.users_credentials (
    id integer NOT NULL,
    user_id integer NOT NULL,
    login character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL
);
 %   DROP TABLE public.users_credentials;
       public         heap    postgres    false            �            1259    24608    users_credentials_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_credentials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.users_credentials_id_seq;
       public          postgres    false    218            �           0    0    users_credentials_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.users_credentials_id_seq OWNED BY public.users_credentials.id;
          public          postgres    false    217            �            1259    24597    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            :           2604    32793    notes id    DEFAULT     d   ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);
 7   ALTER TABLE public.notes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            7           2604    24626    refresh_tokens id    DEFAULT     v   ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);
 @   ALTER TABLE public.refresh_tokens ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            @           2604    32876    todo_items id    DEFAULT     n   ALTER TABLE ONLY public.todo_items ALTER COLUMN id SET DEFAULT nextval('public.todo_items_id_seq'::regclass);
 <   ALTER TABLE public.todo_items ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225    226            =           2604    32862    todo_lists id    DEFAULT     n   ALTER TABLE ONLY public.todo_lists ALTER COLUMN id SET DEFAULT nextval('public.todo_lists_id_seq'::regclass);
 <   ALTER TABLE public.todo_lists ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    224    224            3           2604    24601    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            6           2604    24612    users_credentials id    DEFAULT     |   ALTER TABLE ONLY public.users_credentials ALTER COLUMN id SET DEFAULT nextval('public.users_credentials_id_seq'::regclass);
 C   ALTER TABLE public.users_credentials ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            R           2606    32799    notes notes_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_pkey;
       public            postgres    false    222            N           2606    24630 "   refresh_tokens refresh_tokens_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.refresh_tokens DROP CONSTRAINT refresh_tokens_pkey;
       public            postgres    false    220            P           2606    24632 ,   refresh_tokens refresh_tokens_token_hash_key 
   CONSTRAINT     m   ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);
 V   ALTER TABLE ONLY public.refresh_tokens DROP CONSTRAINT refresh_tokens_token_hash_key;
       public            postgres    false    220            V           2606    32884    todo_items todo_items_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.todo_items
    ADD CONSTRAINT todo_items_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.todo_items DROP CONSTRAINT todo_items_pkey;
       public            postgres    false    226            T           2606    32866    todo_lists todo_lists_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.todo_lists
    ADD CONSTRAINT todo_lists_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.todo_lists DROP CONSTRAINT todo_lists_pkey;
       public            postgres    false    224            J           2606    24616 -   users_credentials users_credentials_login_key 
   CONSTRAINT     i   ALTER TABLE ONLY public.users_credentials
    ADD CONSTRAINT users_credentials_login_key UNIQUE (login);
 W   ALTER TABLE ONLY public.users_credentials DROP CONSTRAINT users_credentials_login_key;
       public            postgres    false    218            L           2606    24614 (   users_credentials users_credentials_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.users_credentials
    ADD CONSTRAINT users_credentials_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.users_credentials DROP CONSTRAINT users_credentials_pkey;
       public            postgres    false    218            F           2606    24605    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            H           2606    24607    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    216            Y           2606    32800    notes notes_user_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 B   ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_user_id_fkey;
       public          postgres    false    216    222    4678            X           2606    24633 *   refresh_tokens refresh_tokens_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.refresh_tokens DROP CONSTRAINT refresh_tokens_user_id_fkey;
       public          postgres    false    216    220    4678            [           2606    32885 '   todo_items todo_items_todo_list_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.todo_items
    ADD CONSTRAINT todo_items_todo_list_id_fkey FOREIGN KEY (todo_list_id) REFERENCES public.todo_lists(id);
 Q   ALTER TABLE ONLY public.todo_items DROP CONSTRAINT todo_items_todo_list_id_fkey;
       public          postgres    false    226    224    4692            Z           2606    32867 "   todo_lists todo_lists_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.todo_lists
    ADD CONSTRAINT todo_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 L   ALTER TABLE ONLY public.todo_lists DROP CONSTRAINT todo_lists_user_id_fkey;
       public          postgres    false    4678    224    216            W           2606    24617 0   users_credentials users_credentials_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_credentials
    ADD CONSTRAINT users_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.users_credentials DROP CONSTRAINT users_credentials_user_id_fkey;
       public          postgres    false    216    218    4678           