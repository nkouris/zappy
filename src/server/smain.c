/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   smain.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nkouris <nkouris@student.42.us.org>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/05/14 12:20:21 by nkouris           #+#    #+#             */
/*   Updated: 2018/06/06 18:55:10 by mray             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "server.h"
#include "board.h"
#include "communication.h"

t_opts	arr_opts[] = {
	{"p", 1, &srv_setport},
	{"x", 1, &srv_setboardx},
	{"y", 1, &srv_setboardy},
	{"n", 1, &srv_setteams},
	{"c", 1, &srv_setmaxclients},
	{"t", 1, &srv_settimeint},
	{NULL, 0, NULL}
};

static inline __attribute__((always_inline))int32_t	init_fd_select(void)
{
	if (!(SRV_SOCK.input = (fd_set *)ft_memalloc(sizeof(fd_set)))
		|| !(SRV_SOCK.copy = (fd_set *)ft_memalloc(sizeof(fd_set))))
	{
		perror(strerror(errno));
		return (EXIT_FAILURE);
	}
	FD_ZERO(SRV_SOCK.input);
	FD_ZERO(SRV_SOCK.copy);
	FD_SET(SRV_SOCK.sockfd, SRV_SOCK.input);
	FD_COPY(SRV_SOCK.input, SRV_SOCK.copy);
	SRV_SOCK.nfds = (SRV_SOCK.sockfd + 1);
	return (EXIT_SUCCESS);
}

static inline __attribute__((always_inline))int32_t	set_sock(void)
{
	SRV_SOCK.proto = getprotobyname("tcp");
	SRV_SOCK.socklen = sizeof(struct sockaddr_in);
	SRV_SOCK.sockfd = socket(AF_INET, SOCK_STREAM, (SRV_SOCK.proto)->p_proto);
	(SRV_SOCK.address).sin_family = AF_INET;
	(SRV_SOCK.address).sin_port = htons(SRV_SOCK.port);
	(SRV_SOCK.address).sin_addr.s_addr = INADDR_ANY;
	if ((setsockopt(SRV_SOCK.sockfd, SOL_SOCKET, SO_REUSEADDR,
			&(SRV_SOCK.opt_val), sizeof(int32_t)) < 0)
		|| (setsockopt(SRV_SOCK.sockfd, SOL_SOCKET, SO_REUSEPORT,
			&(SRV_SOCK.opt_val), sizeof(int32_t)) < 0))
		return (EXIT_FAILURE);
	return (EXIT_SUCCESS);
}

static int32_t		ft_serverinit(void)
{
	int32_t	ret;

	ret = 0;
	board.new();
	if ((set_sock() == EXIT_FAILURE)
		|| (bind(SRV_SOCK.sockfd, ((struct sockaddr *)&(SRV_SOCK.address)),
			sizeof(struct sockaddr_in)) < 0)
		|| (listen(SRV_SOCK.sockfd, 128) < 0)
		|| (init_fd_select() == EXIT_FAILURE))
		return (EXIT_FAILURE);
	while ((select(SRV_SOCK.nfds, SRV_SOCK.input, NULL, NULL, NULL)) > 0)
	{
		printf("pre game -- select unblock\n");
		if ((ret = pregame_io()) == EXIT_FAILURE)
			return (EXIT_FAILURE);
	}
	return (EXIT_SUCCESS);
}

int32_t		main(int argc, char **argv)
{
	int32_t	arg;

	arg = 0;
	if (argc < 2)
	{
		usage_warning(NULL);
		return (EXIT_FAILURE);
	}
	if (!(g_servenv = (t_servenv *)ft_memalloc(sizeof(t_servenv))))
		return (EXIT_FAILURE);
	if ((arg = ft_getopts(arr_opts, argv)) != EXIT_SUCCESS)
		usage_warning(argv[arg]);
#ifdef DEBUG
	ft_printf("set port : %d\nset boardwidth : %d\nset boardheight : %d\nset max clients : %d\ntime interval : %d\n", SRV_SOCK.port, (g_servenv->board.x), (g_servenv->board.y), SRV_GENV.maxclients, SRV_GENV.timeint);
#endif
	if (ft_serverinit() == EXIT_FAILURE)
		perror(strerror(errno));
	return (EXIT_SUCCESS);
}
